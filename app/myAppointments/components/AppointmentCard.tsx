"use client";

import { Calendar, CircleUser, Clock8, MapPin } from "lucide-react";
import MainButton from "../../components/MainButton";
import { Bookings } from "../actions/actions";
import Modal from "@/app/profile/components/Modal";

export default function AppointmentCard({
  isOpen,
  setIsOpen,
  bookings,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookings: Bookings;
}) {
  type BookingStatus = "Pending" | "Upcoming" | "Completed" | "Cancelled";
  const statusColorMap: Record<BookingStatus, string> = {
    Pending: "bg-yellow-400",
    Upcoming: "bg-orange-400",
    Completed: "bg-green-400",
    Cancelled: "bg-red-400",
  };
  const status = bookings.status as BookingStatus;
  return (
    <div className="mt-4 bg-background w-[90%] lg:max-w-xl lg:w-full p-3 rounded-xl border-border border">
      <div className="flex justify-between">
        <p className="text-foreground font-bold text-lg">{bookings.name}</p>
        <p
          className={`${
            statusColorMap[status] || "bg-gray-400"
          } rounded-full px-2 py-1 text-black text-xs`}
        >
          {bookings.status}
        </p>
      </div>
      <div className="flex gap-2 mb-4">
        <CircleUser fontSize={14} className="text-foreground/40" />
        <p className="text-foreground/40">{bookings.businessName}</p>
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
          <p className="text-foreground">{bookings.date}</p>
        </div>
        <div className="flex gap-1">
          <MapPin fontSize={14} className="text-foreground" />
          <p className="text-foreground">Thessaloniki</p>
        </div>
      </div>
      {status === "Pending" || status === "Upcoming" ? (
        <div className="w-full">
          <MainButton onClick={() => setIsOpen(true)} className="w-full mt-4">
            Reschedule
          </MainButton>
        </div>
      ) : null}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h1>Rescheduling functionality coming soon!</h1>
        </Modal>
      )}
    </div>
  );
}
