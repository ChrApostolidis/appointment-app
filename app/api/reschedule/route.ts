import { ReschedulingSchema } from "@/app/book/[id]/schema";
import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import { appoinmentsTable } from "@/drizzle/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { startAt, endAt, appointmentId } = await req.json();

  if (!startAt || !endAt || !appointmentId) {
    return NextResponse.json(
      { error: "startAt, endAt, and appointmentId are required" },
      { status: 400 },
    );
  }

  const parsed = ReschedulingSchema.safeParse({
    startAt,
    endAt,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data", details: parsed.error },
      { status: 400 },
    );
  }

  try {
    await db
      .update(appoinmentsTable)
      .set({
        startAt: new Date(parsed.data.startAt),
        endAt: new Date(parsed.data.endAt),
        status: "Pending",
      })
      .returning({
        id: appoinmentsTable.id,
        startAt: appoinmentsTable.startAt,
        endAt: appoinmentsTable.endAt,
      })
      .where(eq(appoinmentsTable.id, appointmentId));
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error("Error booking appointment");
  }

  const userData = await getCurrentUser({ withFullUser: true });
  const email = userData?.email;
  if (!email) {
    console.error("No user email found for booking notification");
    return;
  }

  const name = userData?.name;
  if (!name) {
    console.error("No user name found for booking notification");
    return;
  }

  return NextResponse.json({ status: 201 });
}
