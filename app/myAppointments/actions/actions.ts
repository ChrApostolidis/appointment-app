"use server";

import { db } from "@/drizzle/db";
import { appoinmentsTable, ProviderTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export type Bookings = {
    appointmentId: string;
    startAt: Date;
    endAt: Date;
    status: string;
    providerId: string;
    businessName: string;
    serviceCategory: string;
}

export async function getBookedAppointments(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch appointments.");
  }
  try {
    const bookedAppointments = await db
      .select({
        appointmentId: appoinmentsTable.id,
        startAt: appoinmentsTable.startAt,
        endAt: appoinmentsTable.endAt,
        status: appoinmentsTable.status,
        providerId: ProviderTable.userId,
        businessName: ProviderTable.businessName,
        serviceCategory: ProviderTable.serviceCategory,
      })
      .from(appoinmentsTable)
      .innerJoin(
        ProviderTable,
        eq(appoinmentsTable.providerId, ProviderTable.userId)
      )
      .where(eq(appoinmentsTable.customerId, userId))
      .orderBy(appoinmentsTable.startAt);

    return bookedAppointments as Bookings[];
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    throw new Error("Could not load appointments");
  }
}
