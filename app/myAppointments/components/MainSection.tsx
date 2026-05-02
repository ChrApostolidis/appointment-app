"use client";

import BookingFilter from "../components/BookingFilter";
import AppointmentCard from "../components/AppointmentCard";
import {
  AppointmentStatusTab,
  Bookings,
  ProviderBookings,
  StatusCounts,
} from "../actions/actions";
import { userType } from "@/app/registerForms/components/LockedRegisterForm";
import ProviderAppointmentCard from "./ProviderAppointmentCard";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { CalendarX } from "lucide-react";

const EMPTY_STATE_COPY: Record<
  AppointmentStatusTab,
  { title: string; subtitle: string }
> = {
  All: {
    title: "No appointments yet",
    subtitle: "Once bookings are made they'll appear here.",
  },
  Pending: {
    title: "No pending bookings",
    subtitle: "You're all caught up — nothing waiting for review.",
  },
  Upcoming: {
    title: "No upcoming appointments",
    subtitle: "Your schedule is clear right now.",
  },
  Completed: {
    title: "No completed appointments",
    subtitle: "Past appointments will appear here once they're done.",
  },
  Cancelled: {
    title: "No cancelled appointments",
    subtitle: "Anything cancelled will be archived here.",
  },
};

export default function MainSection({
  bookings,
  user,
  currentTab,
  currentPage,
  pageSize,
  totalCount,
  statusCounts,
}: {
  bookings: Bookings[] | ProviderBookings[];
  user: userType;
  currentTab: AppointmentStatusTab;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  statusCounts: StatusCounts;
}) {
  const emptyCopy = EMPTY_STATE_COPY[currentTab];

  return (
    <div className="flex flex-col justify-center items-center pb-10">
      <BookingFilter currentTab={currentTab} statusCounts={statusCounts} />

      {bookings.length > 0 ? (
        <>
          {bookings.map((booking) => (
            <div
              key={booking.appointmentId}
              className="w-full flex justify-center"
            >
              {user.role === "user" ? (
                <AppointmentCard bookings={booking as Bookings} />
              ) : (
                <ProviderAppointmentCard bookings={booking as ProviderBookings} />
              )}
            </div>
          ))}

          {totalCount > pageSize && (
            <div className="w-[90%] lg:max-w-2xl mt-8">
              <PaginationWithLinks
                page={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                navigationMode="router"
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center text-center mt-10 px-6">
          <div className="w-14 h-14 rounded-full bg-second-background flex items-center justify-center mb-4">
            <CalendarX size={26} className="text-muted-foreground" />
          </div>
          <p className="text-foreground text-xl lg:text-2xl font-semibold">
            {emptyCopy.title}
          </p>
          <p className="text-muted-foreground text-sm mt-2 max-w-sm">
            {emptyCopy.subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
