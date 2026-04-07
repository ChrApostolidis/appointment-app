"use client";

import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock8,
  Mail,
  MapPin,
  XCircle,
} from "lucide-react";
import MainButton from "../../components/MainButton";
import {
  cancelBooking,
  confirmBooking,
  ProviderBookings,
} from "../actions/actions";
import Modal from "@/app/profile/components/Modal";
import { useState, useTransition } from "react";

type ProviderAppointmentCardProps = {
  bookings: ProviderBookings;
};

type BookingStatus = "Pending" | "Upcoming" | "Completed" | "Cancelled";

const statusAccentMap: Record<BookingStatus, string> = {
  Pending: "bg-yellow-400",
  Upcoming: "bg-orange-400",
  Completed: "bg-green-400",
  Cancelled: "bg-red-400",
};

const statusPillMap: Record<BookingStatus, string> = {
  Pending: "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400",
  Upcoming: "bg-orange-400/15 text-orange-600 dark:text-orange-400",
  Completed: "bg-green-400/15 text-green-600 dark:text-green-400",
  Cancelled: "bg-red-400/15 text-red-500 dark:text-red-400",
};

export default function ProviderAppointmentCard({
  bookings,
}: ProviderAppointmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<
    "cancel" | "confirm" | null
  >(null);

  const handleCancel = () => {
    setPendingAction("cancel");
    startTransition(async () => {
      await cancelBooking(bookings.appointmentId);
      setPendingAction(null);
    });
  };

  const handleConfirm = () => {
    setPendingAction("confirm");
    startTransition(async () => {
      await confirmBooking(bookings.appointmentId);
      setPendingAction(null);
    });
  };

  const status = bookings.status as BookingStatus;

  const initials = bookings.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-[90%] lg:max-w-xl lg:w-full mt-4 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex">
      {/* Status accent stripe */}
      <div className={`w-1 shrink-0 ${statusAccentMap[status] ?? "bg-gray-400"}`} />

      <div className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary text-sm font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-foreground font-semibold text-base leading-snug truncate">
                {bookings.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail size={12} className="text-muted-foreground shrink-0" />
                <p className="text-muted-foreground text-sm truncate">
                  {bookings.email}
                </p>
              </div>
            </div>
          </div>
          <span
            className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
              statusPillMap[status] ?? "bg-gray-400/15 text-gray-600"
            }`}
          >
            {bookings.status}
          </span>
        </div>

        {/* Service badge */}
        <div className="inline-flex items-center gap-1.5 bg-second-background border border-border px-3 py-1 rounded-full mb-4">
          <Briefcase size={12} className="text-primary shrink-0" />
          <span className="text-foreground text-xs font-medium">
            {bookings.serviceName ?? "Basic Appointment"}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-4" />

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-second-background flex items-center justify-center">
              <Clock8 size={15} className="text-primary" />
            </div>
            <p className="text-foreground text-xs text-center leading-tight">
              {bookings.startAt}-{bookings.endAt}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-second-background flex items-center justify-center">
              <Calendar size={15} className="text-primary" />
            </div>
            <p className="text-foreground text-xs text-center leading-tight">
              {bookings.date}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-second-background flex items-center justify-center">
              <MapPin size={15} className="text-primary" />
            </div>
            <p className="text-foreground text-xs text-center leading-tight">
              Thessaloniki
            </p>
          </div>
        </div>

        {/* Manage button for pending */}
        {status === "Pending" && (
          <div className="mt-5 pt-4 border-t border-border">
            <MainButton onClick={() => setIsOpen(true)} className="w-full">
              Manage Booking
            </MainButton>
          </div>
        )}
      </div>

      {/* Manage modal */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div>
            <p className="text-foreground text-xl font-semibold text-center lg:text-2xl mb-6">
              Manage Booking
            </p>

            {/* Client info */}
            <div className="bg-second-background rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client</span>
                <span className="text-foreground font-medium">{bookings.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground font-medium">{bookings.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground font-medium">{bookings.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground font-medium">
                  {bookings.startAt} – {bookings.endAt}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service</span>
                <span className="text-foreground font-medium">
                  {bookings.serviceName ?? "Basic Appointment"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                disabled={isPending}
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <XCircle size={16} />
                {pendingAction === "cancel" && isPending ? "Cancelling..." : "Cancel"}
              </button>
              <button
                disabled={isPending}
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle size={16} />
                {pendingAction === "confirm" && isPending ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
