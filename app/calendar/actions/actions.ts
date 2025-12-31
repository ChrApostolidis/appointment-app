"use server";

import { db } from "@/drizzle/db";
import { appoinmentsTable, ProviderTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getUserAppointmentsById(userId: string) {
  if (!userId) {
    return [];
  }

  try {
    const providers = await db
      .select({
        id: appoinmentsTable.id,
        title: ProviderTable.businessName,
        startAt: appoinmentsTable.startAt,
        endAt: appoinmentsTable.endAt,
        status: appoinmentsTable.status,
      })
      .from(appoinmentsTable)
      .where(eq(appoinmentsTable.customerId, userId))
      .innerJoin(
        ProviderTable,
        eq(appoinmentsTable.providerId, ProviderTable.userId)
      );

    return providers;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}
