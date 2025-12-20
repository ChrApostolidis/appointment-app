"use client";

import {
  Calendar,
  CircleUser,
  Clock8,
  Mail,
  MapPin,
  OctagonAlertIcon,
  Phone,
} from "lucide-react";
import MainButton from "../../components/MainButton";
import { cancelBooking, ProviderBookings } from "../actions/actions";
import Modal from "@/app/profile/components/Modal";
import { useTransition } from "react";

type ProviderAppointmentCardProps = {
  bookings: ProviderBookings;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type BookingStatus = "Pending" | "Upcoming" | "Completed" | "Cancelled";

export default function ProviderAppointmentCard({
  bookings,
  isOpen,
  setIsOpen,
}: ProviderAppointmentCardProps) {
  const [isPending, startTransition] = useTransition();
  const status = bookings.status as BookingStatus;

  const statusColorMap: Record<BookingStatus, string> = {
    Pending: "bg-yellow-400",
    Upcoming: "bg-orange-400",
    Completed: "bg-green-400",
    Cancelled: "bg-red-400",
  };
  return (
    <div className="mt-4 bg-background w-[90%] lg:max-w-xl lg:w-full p-3 rounded-xl border-border border">
      <div className="flex gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
          <CircleUser fontSize={24} className="text-foreground" />
          <p className="text-foreground text-lg">{bookings.name}</p>
        </div>
        <div className="flex">
          <p
            className={`${
              statusColorMap[status] || "bg-gray-400"
            } rounded-full px-2 py-1 text-black text-xs font-bold`}
          >
            {bookings.status}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
          <Mail fontSize={24} className="text-foreground" />
          <p className="text-foreground text-lg">{bookings.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone fontSize={24} className="text-foreground" />
          <p className="text-foreground text-lg">2310-555-222</p>
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
          <p className="text-foreground">{bookings.date}</p>
        </div>
        <div className="flex gap-1">
          <MapPin fontSize={14} className="text-foreground" />
          <p className="text-foreground">Thessaloniki</p>
        </div>
      </div>
      {bookings.status === "Pending" && (
        <>
          <div className="w-full">
            <>
              <div className="flex bg-yellow-400 rounded-full px-2 py-1 mx-20 text-black mb-1 justify-center items-center gap-2">
                <OctagonAlertIcon fontSize={24}/>
                <p>
                  Awaiting Confirmation
                </p>
              </div>
              <MainButton
                onClick={() => setIsOpen(true)}
                className="w-full mt-4"
              >
                Manage Booking
              </MainButton>
            </>
          </div>
          <div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div>
                <p className="text-foreground text-xl text-center lg:text-2xl">
                  Manage Booking
                </p>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      <p className="text-xl">Name:</p>
                      <p className="text-foreground text-lg">{bookings.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="text-xl">Email:</p>
                      <p className="text-foreground text-lg">
                        {bookings.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-1">
                      <p className="text-xl">Time:</p>
                      <p className="text-xl text-foreground">
                        {bookings.startAt} - {bookings.endAt}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <p className="text-xl">Date:</p>
                      <p className="text-xl text-foreground">{bookings.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MainButton
                      variant="danger"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await cancelBooking(bookings.appointmentId);
                        })
                      }
                      className="w-full mt-4"
                    >
                      {isPending ? "Cancelling..." : "Cancel Booking"}
                    </MainButton>
                    <MainButton className="w-full mt-4">
                      Confirm Booking
                    </MainButton>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}
