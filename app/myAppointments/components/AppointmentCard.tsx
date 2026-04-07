"use client";

import { Briefcase, Calendar, Clock2, Clock8, MapPin, Store } from "lucide-react";
import MainButton from "../../components/MainButton";
import { Bookings } from "../actions/actions";
import Modal from "@/app/profile/components/Modal";
import Appoinements from "@/app/book/[id]/components/Appoinements";
import ContainerCalendar from "@/app/book/[id]/components/ContainerCalendar";
import { useState } from "react";
import { AppointmentSlot } from "@/app/book/[id]/components/ConfirmBookingSection";
import FailedModal from "@/app/book/[id]/components/FailedModal";
import SuccessModal from "@/app/book/[id]/components/SuccessModal";
import { WorkingHours } from "@/app/profile/data/hoursData";
import { getProviderWorkingHoursById } from "@/app/profile/actions/profileActions";
import { getProviderById, singleProvider } from "@/app/book/actions/actions";
import { useRouter } from "next/navigation";

type AppointmentCardProps = {
  bookings: Bookings;
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

export default function AppointmentCard({ bookings }: AppointmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const status = bookings.status as BookingStatus;
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<
    AppointmentSlot[] | null
  >(null);
  const [selectedTime, setSelectedTime] = useState<AppointmentSlot | undefined>(
    undefined,
  );
  const [workingHours, setWorkingHours] = useState<WorkingHours | undefined>(
    undefined,
  );
  const [provider, setProvider] = useState<singleProvider | null>(null);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      if (!selectedTime) throw new Error("No time selected");

      const res = await fetch("/api/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: bookings.appointmentId,
          startAt: selectedTime.startAt,
          endAt: selectedTime.endAt,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }
      setShowSuccess(true);
    } catch (err) {
      setShowFailed(true);
      console.error("Error rescheduling appointment:", err);
    } finally {
      setIsDisabled(false);
      setIsOpen(false);
    }
  };

  const handleRescheduleClick = async () => {
    const hours = await getProviderWorkingHoursById(bookings.providerId);
    const providerData = await getProviderById(bookings.providerId);

    if (!hours) {
      console.log("Error fetching working hours");
      return;
    }

    setWorkingHours(hours);
    setProvider(providerData);
    setIsOpen(true);
  };

  return (
    <div className="w-[90%] lg:max-w-xl lg:w-full mt-4 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex">
      {/* Status accent stripe */}
      <div className={`w-1 shrink-0 ${statusAccentMap[status] ?? "bg-gray-400"}`} />

      <div className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-foreground font-semibold text-base leading-snug truncate">
              {bookings.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Store size={12} className="text-muted-foreground shrink-0" />
              <p className="text-muted-foreground text-sm truncate">
                {bookings.businessName}
              </p>
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
              {bookings.startAt}
              <br />
              {bookings.endAt}
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

        {/* Reschedule button */}
        {(status === "Pending" || status === "Upcoming") && (
          <div className="mt-5 pt-4 border-t border-border">
            <MainButton onClick={handleRescheduleClick} className="w-full">
              Reschedule
            </MainButton>
          </div>
        )}
      </div>

      {/* Reschedule modal */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <form onSubmit={handleReschedule}>
            <div className="flex flex-col gap-5">
              <h3 className="text-xl lg:text-2xl text-foreground">
                Reschedule Appointment
              </h3>
              <div className="flex justify-start gap-2 pb-2 border-b border-primary">
                <Calendar size={18} className="text-foreground" />
                <p className="text-sm text-foreground">Select Date</p>
              </div>
              <ContainerCalendar
                setIsLoading={setIsLoading}
                setAvailableAppointments={setAvailableAppointments}
                date={date}
                setDate={setDate}
                providerId={bookings.providerId}
                workingHours={workingHours}
              />
              <div className="flex justify-start gap-2 pb-2 border-b border-primary">
                <Clock2 size={18} className="text-foreground" />
                <p className="text-sm text-foreground">Select Time</p>
              </div>
              <Appoinements
                isLoading={isLoading}
                availableAppointments={availableAppointments}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                setIsDisabled={setIsDisabled}
              />
            </div>
            <div className="flex justify-center items-center mt-3 border-t border-primary pt-4">
              <MainButton type="submit" disabled={isDisabled}>
                Reschedule Appointment
              </MainButton>
            </div>
          </form>
        </Modal>
      )}

      {showSuccess && provider && (
        <SuccessModal
          date={date}
          selectedTime={selectedTime}
          provider={provider}
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            router.refresh();
          }}
        />
      )}

      {showFailed && (
        <FailedModal isOpen={showFailed} onClose={() => setShowFailed(false)} />
      )}
    </div>
  );
}
