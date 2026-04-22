"use server";

import { formatTime } from "@/app/book/utils/helper";
import { db } from "@/drizzle/db";
import { appoinmentsTable, ProviderTable, UserTable } from "@/drizzle/schema";
import { and, eq, inArray, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type Bookings = {
  startAt: string;
  endAt: string;
  appointmentId: string;
  status: string;
  providerId: string;
  businessName: string;
  serviceCategory: string;
  serviceName: string | null;
  name: string;
  date: string;
};

export async function getBookedAppointments(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch appointments.");
  }
  updateBookingsToCompleted();
  updateExpiredPendingBookingsToCanceled();
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
        serviceName: appoinmentsTable.serviceName,
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
  serviceName: string | null;
  date: string;
};

export async function getBookedAppointmentsForProvider(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch appointments.");
  }
  await updateBookingsToCompleted();
  await updateExpiredPendingBookingsToCanceled();
  try {
    const bookedAppointments = await db
      .select({
        appointmentId: appoinmentsTable.id,
        startAt: appoinmentsTable.startAt,
        endAt: appoinmentsTable.endAt,
        name: UserTable.name,
        email: UserTable.email,
        status: appoinmentsTable.status,
        serviceName: appoinmentsTable.serviceName,
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
      .set({ status: "Cancelled", updatedAt: new Date() })
      .where(eq(appoinmentsTable.id, appointmentId));
    revalidatePath("/myAppointments");
  } catch (err) {
    console.error("Failed to cancel booking:", err);
    throw new Error("Could not cancel booking");
  }
}

export async function confirmBooking(appointmentId: string) {
  try {
    await db
      .update(appoinmentsTable)
      .set({ status: "Upcoming", updatedAt: new Date() })
      .where(eq(appoinmentsTable.id, appointmentId));
    revalidatePath("/myAppointments");
  } catch (err) {
    console.error("Failed to confirm booking:", err);
    throw new Error("Could not confirm booking");
  }
}

export async function updateBookingsToCompleted() {
  const cutoff = new Date(Date.now() - 60_000); // current time minus 1 minute to account for any slight delays
  await db
    .update(appoinmentsTable)
    .set({ status: "Completed", updatedAt: new Date() })
    .where(
      and(
        lte(appoinmentsTable.startAt, cutoff),
        inArray(appoinmentsTable.status, ["Upcoming"])
      )
    );
}

export async function updateExpiredPendingBookingsToCanceled() {
  const cutoff = new Date(Date.now() - 60_000);

  const expired = await db
    .select({
      startAt: appoinmentsTable.startAt,
      endAt: appoinmentsTable.endAt,
      email: UserTable.email,
      name: UserTable.name,
      businessName: ProviderTable.businessName,
      serviceCategory: ProviderTable.serviceCategory,
      serviceName: appoinmentsTable.serviceName,
    })
    .from(appoinmentsTable)
    .innerJoin(UserTable, eq(appoinmentsTable.customerId, UserTable.id))
    .innerJoin(ProviderTable, eq(appoinmentsTable.providerId, ProviderTable.userId))
    .where(
      and(
        lte(appoinmentsTable.startAt, cutoff),
        eq(appoinmentsTable.status, "Pending")
      )
    );

  if (expired.length === 0) return;

  await db
    .update(appoinmentsTable)
    .set({ status: "Cancelled", updatedAt: new Date() })
    .where(
      and(
        lte(appoinmentsTable.startAt, cutoff),
        eq(appoinmentsTable.status, "Pending")
      )
    );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  await Promise.all(
    expired.map((appt) =>
      fetch(new URL("/api/notificationCancelled", baseUrl).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: appt.name,
          email: appt.email,
          startAt: appt.startAt.toISOString(),
          endAt: appt.endAt.toISOString(),
          businessName: appt.businessName,
          serviceCategory: appt.serviceCategory,
          ...(appt.serviceName ? { serviceName: appt.serviceName } : {}),
        }),
      }).catch((err) => console.error("Failed to send cancellation email:", err))
    )
  );
}
