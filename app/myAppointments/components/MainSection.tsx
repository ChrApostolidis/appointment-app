"use client";

import BookingFilter from "../components/BookingFilter";
import AppointmentCard from "../components/AppointmentCard";
import { Bookings } from "../actions/actions";
import { useMemo, useState } from "react";

export type Fitlers = "All" | "Upcoming" | "Completed" | "Cancelled";

export default function MainSection({ bookings }: { bookings: Bookings[] }) {
  const [filters, setFilters] = useState<Fitlers>("All");

  const filteredBookings = useMemo(() => {
    if (filters === "All") {
      return bookings;
    } else if (filters === "Upcoming") {
      return bookings.filter((booking) => booking.status === "Upcoming");
    } else if (filters === "Completed") {
      return bookings.filter((booking) => booking.status === "Completed");
    } else if (filters === "Cancelled") {
      return bookings.filter((booking) => booking.status === "Cancelled");
    } else {
      throw new Error("Invalid filter option");
    }
  }, [filters, bookings]);


  return (
    <div className="flex flex-col justify-center items-center">
      <BookingFilter filter={filters} setFilter={setFilters} />
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking) => (
          <div
            key={booking.appointmentId}
            className="w-full flex justify-center"
          >
            <AppointmentCard bookings={booking} />
          </div>
        ))
      ) : (
        <p className="text-foreground mt-4 text-2xl">No appointments found.</p>
      )}
    </div>
  );
}
