"use client";

import { Calendar, CircleUser, Clock8, MapPin } from "lucide-react";
import MainButton from "../../components/MainButton";
import { ProviderBookings } from "../actions/actions";

export default function ProviderAppointmentCard({
  bookings,
}: {
  bookings: ProviderBookings;
}) {
  return (
    <div className="mt-4 bg-background w-[90%] lg:max-w-xl lg:w-full p-3 rounded-xl border-border border">
      <div className="flex gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
            <CircleUser fontSize={24} className="text-foreground" />
            <p className="text-foreground text-lg">{bookings.name}</p>
        </div>
        <div className="flex">
            <p className="text-foreground text-lg">{bookings.email}</p>
        </div>
      </div>
      <div className="my-5 flex flex-col lg:flex-row gap-2 lg:gap-4 lg:justify-between">
        <div className="flex gap-1">
          <Clock8 fontSize={14} className="text-foreground" />
          <p className="text-foreground">
            {bookings.startAt} - {bookings.endAt}
          </p>
        </div>
        <div className="flex gap-1">
          <Calendar fontSize={14} className="text-foreground" />
          <p className="text-foreground">
            {bookings.date}
          </p>
        </div>
        <div className="flex gap-1">
          <MapPin fontSize={14} className="text-foreground" />
          <p className="text-foreground">Thessaloniki</p>
        </div>
      </div>
      <div className="w-full">
        <MainButton className="w-full mt-4">Manage Booking</MainButton>
      </div>
    </div>
  );
}
