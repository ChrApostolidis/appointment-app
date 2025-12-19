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
  date: string;
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
      date: new Date(appointment.startAt).toLocaleDateString(),
    }));

    return formattedAppointments as Bookings[];
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    throw new Error("Could not load appointments");
  }
}

export type ProviderBookings = {
  startAt: string;
  endAt: string;
  appointmentId: string;
  email: string;
  name: string;
  status: string;
  date: string;
};

export async function getBookedAppointmentsForProvider(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch appointments.");
  }
  try {
    const bookedAppointments = await db
      .select({
        appointmentId: appoinmentsTable.id,
        startAt: appoinmentsTable.startAt,
        endAt: appoinmentsTable.endAt,
        name: UserTable.name,
        email: UserTable.email,
        status: appoinmentsTable.status,
      })
      .from(appoinmentsTable)
      .innerJoin(UserTable, eq(appoinmentsTable.customerId, UserTable.id))
      .where(eq(appoinmentsTable.providerId, userId))
      .orderBy(appoinmentsTable.startAt);

    const formattedAppointments = bookedAppointments.map((appointment) => ({
      ...appointment,
      startAt: formatTime(appointment.startAt),
      endAt: formatTime(appointment.endAt),
      date: new Date(appointment.startAt).toLocaleDateString(),
    }));

    return formattedAppointments as ProviderBookings[];
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    throw new Error("Could not load appointments");
  }
}

export async function cancelBooking(appointmentId: string) {
  try {
    await db
      .update(appoinmentsTable)
      .set({ status: "Cancelled" })
      .where(eq(appoinmentsTable.id, appointmentId));
  } catch (err) {
    console.error("Failed to cancel booking:", err);
    throw new Error("Could not cancel booking");
  }
}
