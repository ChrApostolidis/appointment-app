import { BookingSchema } from "@/app/book/[id]/schema";
import { bookAppointment } from "@/app/book/actions/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { startAt, endAt, providerId, customerId, businessName, serviceCategory } = await req.json();

  if (!providerId || !customerId || !startAt || !endAt || !businessName || !serviceCategory) {
    return NextResponse.json(
      { error: "providerId, customerId,startAt,businessName, serviceCategory and endAt are required" },
      { status: 400 }
    );
  }

  const parsed = BookingSchema.safeParse({
    providerId,
    customerId,
    startAt,
    endAt,
    businessName,
    serviceCategory,
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
