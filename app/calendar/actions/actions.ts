"use server";

import { db } from "@/drizzle/db";
import {
  appoinmentsTable,
  ProviderTable,
  UserRole,
  UserTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAppoinmentsByIdAndRole(
  userId: string,
  role: UserRole
) {
  if (!userId) {
    return [];
  }

  try {
    const baseSelection = {
      id: appoinmentsTable.id,
      startAt: appoinmentsTable.startAt,
      endAt: appoinmentsTable.endAt,
      status: appoinmentsTable.status,
    };

    if (role === "provider") {
      const providerAppointments = await db
        .select({
          ...baseSelection,
          title: UserTable.name,
        })
        .from(appoinmentsTable)
        .innerJoin(UserTable, eq(appoinmentsTable.customerId, UserTable.id))
        .where(eq(appoinmentsTable.providerId, userId));

      return providerAppointments;
    }

    const customerAppointments = await db
      .select({
        ...baseSelection,
        title: ProviderTable.businessName,
      })
      .from(appoinmentsTable)
      .where(eq(appoinmentsTable.customerId, userId))
      .innerJoin(
        ProviderTable,
        eq(appoinmentsTable.providerId, ProviderTable.userId)
      );

    return customerAppointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}
