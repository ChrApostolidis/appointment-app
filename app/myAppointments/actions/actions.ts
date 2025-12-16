"use server";

import { formatTime } from "@/app/book/utils/helper";
import { db } from "@/drizzle/db";
import { appoinmentsTable, ProviderTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export type Bookings = {
  startAt: string;
  endAt: string;
  appointmentId: string;
  status: string;
  providerId: string;
  businessName: string;
  serviceCategory: string;
  name: string;
};

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
        name: UserTable.name,
      })
      .from(appoinmentsTable)
      .innerJoin(
        ProviderTable,
        eq(appoinmentsTable.providerId, ProviderTable.userId)
      )
      .innerJoin(UserTable, eq(ProviderTable.userId, UserTable.id))
      .where(eq(appoinmentsTable.customerId, userId))
      .orderBy(appoinmentsTable.startAt);

    const formattedAppointments = bookedAppointments.map((appointment) => ({
      ...appointment,
      startAt: formatTime(appointment.startAt),
      endAt: formatTime(appointment.endAt),
    }));

    return formattedAppointments as Bookings[];
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    throw new Error("Could not load appointments");
  }
}
