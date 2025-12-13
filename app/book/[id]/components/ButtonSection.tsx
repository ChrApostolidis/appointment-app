"use client";
import MainButton from "@/app/components/MainButton";
import Modal from "@/app/profile/components/Modal";
import ContainerCalendar from "./ContainerCalendar";
import { Calendar, Clock2 } from "lucide-react";
import { useState } from "react";
import { WorkingHours } from "@/app/profile/data/hoursData";
import Appoinements from "./Appoinements";

export type AppointmentSlot = {
  startAt: Date;
  endAt: Date;
};

export default function ButtonSection({
  providerId,
  workingHours,
  userId,
}: {
  providerId: string;
  workingHours: WorkingHours;
  userId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<AppointmentSlot | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<
    AppointmentSlot[] | null
  >(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const booking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      if (!selectedTime) throw new Error("No time selected");

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          customerId: userId,
          startAt: selectedTime.startAt,
          endAt: selectedTime.endAt,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
    } catch (err) {
      console.log("Error booking appointment:", err);
    } finally {
      setIsDisabled(false);
      setIsModalOpen(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex justify-end mt-8 pt-6 border-t border-slate-700/50">
      <MainButton
        onClick={handleOpenModal}
        variant="primary"
        className="w-full md:w-auto md:px-8"
      >
        Book Appointment
      </MainButton>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={booking}>
          <div className="flex flex-col gap-5">
            <h3 className="text-xl lg:text-2xl text-foreground">
              Book Appoinement
            </h3>
            <div className="flex justify-start gap-2 pb-2 border-b border-primary">
              <Calendar size={18} className="text-foreground" />
              <p className="text-sm text-foreground">Select Date</p>
            </div>
            <ContainerCalendar
              date={date}
              setDate={setDate}
              providerId={providerId}
              workingHours={workingHours}
              setIsLoading={setIsLoading}
              setAvailableAppointments={setAvailableAppointments}
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
              Confirm Appointment
            </MainButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
