import { NextResponse } from "next/server";
import { getAvailableAppointments } from "@/app/book/actions/actions";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get("providerId");
  const dateISO = searchParams.get("date");

  if (!providerId || !dateISO) {
    return NextResponse.json(
      { error: "providerId and date are required" },
      { status: 400 }
    );
  }

    const selectedDate = new Date(dateISO);
  if (Number.isNaN(selectedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

   try {
    const slots = await getAvailableAppointments(selectedDate, providerId);

    if (slots === "Closed") {
      return NextResponse.json({ slots: "Closed" });
    }

    //  add logic for closed days
    const serialized = slots.map((slot) => ({
      startAt: slot.startAt.toISOString(),
      endAt: slot.endAt.toISOString(),
    }));
    return NextResponse.json({ slots: serialized });
  } catch (error) {
    console.error("Availability fetch failed", error);
    return NextResponse.json(
      { error: "Failed to load availability" },
      { status: 500 }
    );
  }

}