"use server";

import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import {
  logoInfoTable,
  ProviderHoursTable,
  ProviderTable,
  UserTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  NormalizedHourRow,
  validateAndNormalizeHours,
} from "../schema";
import { rowsToWeeklyHours } from "../utils/helper";

export type FullProviderData = {
  businessName: string;
  serviceCategory: string;
  description: string | null;
  email: string;
  logoUrl: string | null;
  createdAt: Date;
};

export async function getFullProviderDataById(
  providerId: string
): Promise<FullProviderData | null> {
  try {
    const provider = await db
      .select({
        businessName: ProviderTable.businessName,
        serviceCategory: ProviderTable.serviceCategory,
        description: ProviderTable.description,
        email: UserTable.email,
        logoUrl: logoInfoTable.logoUrl,
        createdAt: ProviderTable.createdAt,
      })
      .from(ProviderTable)
      // Join the related user via providers.userId -> users.id
      .innerJoin(UserTable, eq(ProviderTable.userId, UserTable.id))
      // Join the optional logo info via providers.logoId -> logo_info.logoId
      .leftJoin(logoInfoTable, eq(ProviderTable.logoId, logoInfoTable.logoId))
      // Filter by the current user id mapped from providers.userId
      .where(eq(ProviderTable.userId, providerId))
      .limit(1);
    return provider[0];
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    return null;
  }
}

export async function updateProviderWorkingHours(payload: unknown) {
  let rows: NormalizedHourRow[];
  try {
    rows = validateAndNormalizeHours(payload);
  } catch (error) {
    console.error("Invalid working hours payload", error);
    throw new Response("Invalid working hours", { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const hoursJson = rowsToWeeklyHours(rows);
  const now = new Date();

  await db
    .insert(ProviderHoursTable)
    .values({ userId: user.id, hours: hoursJson, updatedAt: now })
    .onConflictDoUpdate({
      target: ProviderHoursTable.userId,
      set: { hours: hoursJson, updatedAt: now },
    });

  const [saved] = await db
    .select()
    .from(ProviderHoursTable)
    .where(eq(ProviderHoursTable.userId, user.id))
    .limit(1);

  return (
    saved ?? {
      userId: user.id,
      hours: hoursJson,
    }
  );
}


