import { BookingSchema } from "@/app/book/[id]/schema";
import { bookAppointment } from "@/app/book/actions/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { startAt, endAt, providerId, customerId } = await req.json();

  if (!providerId || !customerId || !startAt || !endAt) {
    return NextResponse.json(
      { error: "providerId, customerId, slotStart and slotEnd are required" },
      { status: 400 }
    );
  }

  const parsed = BookingSchema.safeParse({
    providerId,
    customerId,
    startAt,
    endAt,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking data", details: parsed.error },
      { status: 400 }
    );
  }

  const booking = await bookAppointment(parsed.data);

  return NextResponse.json({ booking }, { status: 201 });
}
