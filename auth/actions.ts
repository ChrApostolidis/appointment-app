"use server";

import { redirect } from "next/navigation";
import { completeSignUpCustomerSchema, completeSignUpProviderSchema, signInSchema, signUpSchema } from "./schema";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { CustomerTable, ProviderTable, UserTable } from "@/drizzle/schema";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "./core/passwordHasher";
import {
  createUserSession,
  getUserFromSession,
  removeUserFromSession,
} from "./core/session";
import { cookies } from "next/headers";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Unable to Log In";

  const user = await db.query.UserTable.findFirst({
    columns: {
      password: true,
      salt: true,
      id: true,
      role: true,
      email: true,
      isProfileComplete: true,
    },
    where: eq(UserTable.email, data.email),
  });

  if (!user) return "User not found";

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log in";

  await createUserSession(user, await cookies());

  redirect(user.isProfileComplete ? "/" : "/registerForms");
}

export async function completeSignUpAsProvider(
  unsafeData: z.infer<typeof completeSignUpProviderSchema>
) {
  // Validate input data
  const { success, data } = completeSignUpProviderSchema.safeParse(unsafeData);
  if (!success) return "Unable to complete registration";

  const session = await cookies();
  const user = await getUserFromSession(session);
  if (!user) return "User not authenticated";

  // Insert provider data
  try {
    await db.insert(ProviderTable).values({
      userId: user.id,
      businessName: data.businessName,
      serviceCategory: data.serviceCategory,
      description: data.description,
    });

    // update user's profile completion status
    await db
      .update(UserTable)
      .set({ isProfileComplete: true })
      .where(eq(UserTable.id, user.id));
  } catch (error) {
    console.log("Error completing registration:", error);
    return `${error}`;
  }
  // Register complete - redirect to home
  redirect("/");
}


export async function completeSignUpAsCustomer(
  unsafeData: z.infer<typeof completeSignUpCustomerSchema>
) {
  // Validate input data
  const { success, data } = completeSignUpCustomerSchema.safeParse(unsafeData);
  if (!success) return "Unable to complete registration";

  const session = await cookies();
  const user = await getUserFromSession(session);
  if (!user) return "User not authenticated";

  // Insert provider data
  try {
    await db.insert(CustomerTable).values({
      userId: user.id,
      interests: data.interests,
    });

    // update user's profile completion status
    await db
      .update(UserTable)
      .set({ isProfileComplete: true })
      .where(eq(UserTable.id, user.id));
  } catch (error) {
    console.log("Error completing registration:", error);
    return `${error}`;
  }
  // Register complete - redirect to home
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
        role: data.role,
        isProfileComplete: false,
      })
      .returning({ id: UserTable.id, role: UserTable.role });
    if (user == null) return "Error creating user null user";

    await createUserSession(user, await cookies());
  } catch (error) {
    console.log("Error creating user:", error);
    return `${error}`;
  }
  redirect("/registerForms");
}

export async function logOut() {
  await removeUserFromSession(await cookies());
  redirect("/authPage");
}
