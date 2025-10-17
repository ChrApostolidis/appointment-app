"use server";

import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "./schema";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { comparePasswords, generateSalt, hashPassword } from "./core/passwordHasher";
import { createUserSession, removeUserFromSession } from "./core/session";
import { cookies } from "next/headers";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Unable to Log In";

  const user = await db.query.UserTable.findFirst({
    columns: {password: true, salt: true, id: true, role: true, email: true},
    where: eq(UserTable.email, data.email),
  });

  if (!user) return "Unable to log in";

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log in";

  await createUserSession(user, await cookies());

  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Unable to create account";
  let existingUser;
  try {
    existingUser = await db.query.UserTable.findFirst({
      where: eq(UserTable.email, data.email),
    });
  } catch (err) {
    console.error("DB query failed:", err);
    return "Database unavailable. Try again later.";
  }

  if (existingUser) return "User already exists";

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const [user] = await db
      .insert(UserTable)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      })
      .returning({ id: UserTable.id, role: UserTable.role });

    if (user == null) return "Error creating user null user";
    await createUserSession(user, await cookies());
  } catch (error) {
    console.log("Error creating user:", error);
    return `${error}`;
  }

  redirect("/");
}

export async function logOut() {
  await removeUserFromSession(await cookies());
  redirect("/authPage");
}
