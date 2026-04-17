import { ReschedulingSchema } from "@/app/book/[id]/schema";
import { db } from "@/drizzle/db";
import { appoinmentsTable, ProviderTable, UserTable } from "@/drizzle/schema";
import { NextResponse } from "next/server";
import { and, eq, gt, lt, ne, notInArray } from "drizzle-orm";
import { getCurrentUser } from "@/auth/currentUser";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { startAt, endAt, appointmentId } = await req.json();

  if (!startAt || !endAt || !appointmentId) {
    return NextResponse.json(
      { error: "startAt, endAt, and appointmentId are required" },
      { status: 400 },
    );
  }

  const parsed = ReschedulingSchema.safeParse({ startAt, endAt });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data", details: parsed.error },
      { status: 400 },
    );
  }

  // Fetch existing appointment with customer and provider details
  const existing = await db
    .select({
      customerId: appoinmentsTable.customerId,
      providerId: appoinmentsTable.providerId,
      serviceName: appoinmentsTable.serviceName,
      customerEmail: UserTable.email,
      customerName: UserTable.name,
      businessName: ProviderTable.businessName,
      serviceCategory: ProviderTable.serviceCategory,
    })
    .from(appoinmentsTable)
    .innerJoin(UserTable, eq(appoinmentsTable.customerId, UserTable.id))
    .innerJoin(ProviderTable, eq(appoinmentsTable.providerId, ProviderTable.userId))
    .where(eq(appoinmentsTable.id, appointmentId))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  if (existing[0].customerId !== currentUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const appointment = existing[0];
  const newStart = new Date(parsed.data.startAt);
  const newEnd = new Date(parsed.data.endAt);

  // Conflict detection: check for overlapping appointments for this provider
  const conflicts = await db
    .select({ id: appoinmentsTable.id })
    .from(appoinmentsTable)
    .where(
      and(
        eq(appoinmentsTable.providerId, appointment.providerId),
        ne(appoinmentsTable.id, appointmentId),
        notInArray(appoinmentsTable.status, ["Cancelled", "Completed"]),
        lt(appoinmentsTable.startAt, newEnd),
        gt(appoinmentsTable.endAt, newStart),
      ),
    );

  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: "The selected time slot is no longer available" },
      { status: 409 },
    );
  }

  try {
    await db
      .update(appoinmentsTable)
      .set({
        startAt: newStart,
        endAt: newEnd,
        status: "Pending",
      })
      .where(eq(appoinmentsTable.id, appointmentId));
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return NextResponse.json(
      { error: "Error rescheduling appointment" },
      { status: 500 },
    );
  }

  // Send reschedule notification email (non-blocking)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  fetch(new URL("/api/notificationReschedule", baseUrl).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: appointment.customerName,
      email: appointment.customerEmail,
      startAt: parsed.data.startAt,
      endAt: parsed.data.endAt,
      businessName: appointment.businessName,
      serviceCategory: appointment.serviceCategory,
      ...(appointment.serviceName ? { serviceName: appointment.serviceName } : {}),
    }),
  }).catch((err) => console.error("Error sending reschedule notification:", err));

  return NextResponse.json({ message: "Appointment rescheduled successfully" }, { status: 200 });
}
