"use client";

import { Calendar, CircleUser, Clock2, Clock8, MapPin } from "lucide-react";
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

export default function AppointmentCard({ bookings }: AppointmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const statusColorMap: Record<BookingStatus, string> = {
    Pending: "bg-yellow-400",
    Upcoming: "bg-orange-400",
    Completed: "bg-green-400",
    Cancelled: "bg-red-400",
  };
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
          <MainButton onClick={handleRescheduleClick} className="w-full mt-4">
            Reschedule
          </MainButton>
        </div>
      ) : null}
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
          onClose={() => { setShowSuccess(false); router.refresh(); }}
        />
      )}

      {showFailed && (
        <FailedModal isOpen={showFailed} onClose={() => setShowFailed(false)} />
      )}
    </div>
  );
}
