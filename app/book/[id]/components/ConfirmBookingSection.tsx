"use client";
import MainButton from "@/app/components/MainButton";
import Modal from "@/app/profile/components/Modal";
import ContainerCalendar from "./ContainerCalendar";
import { Briefcase, Calendar, Clock2 } from "lucide-react";
import { useState, useEffect } from "react";
import { WorkingHours } from "@/app/profile/data/hoursData";
import Appoinements from "./Appoinements";
import SuccessModal from "./SuccessModal";
import { singleProvider } from "../../actions/actions";
import FailedModal from "./FailedModal";
import { Service } from "@/drizzle/schema";

export type AppointmentSlot = {
  startAt: Date;
  endAt: Date;
};

function parseInitialDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function ConfirmBookingSection({
  provider,
  providerId,
  workingHours,
  userId,
  services,
  initialDate,
  autoOpen,
}: {
  provider: singleProvider;
  providerId: string;
  workingHours: WorkingHours;
  userId: string;
  services: Service[];
  initialDate?: string;
  autoOpen?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (autoOpen && initialDate) setIsModalOpen(true);
  }, []);
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? parseInitialDate(initialDate) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<AppointmentSlot | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<
    AppointmentSlot[] | null
  >(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleBooking = async (e: React.FormEvent) => {
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
          businessName: provider.businessName,
          serviceCategory: provider.serviceCategory,
          serviceId: selectedService?.id ?? null,
          serviceName: selectedService?.name ?? null,
        }),
      });
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }
      setShowSuccess(true);
    } catch (err) {
      setShowFailed(true);
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
    <>
      <div className="flex justify-end mt-8 pt-6 border-t border-slate-700/50">
        <MainButton
          onClick={handleOpenModal}
          variant="primary"
          className="w-full md:w-auto md:px-8"
        >
          Book Appointment
        </MainButton>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <form onSubmit={handleBooking}>
            <div className="flex flex-col gap-5">
              <h3 className="text-xl lg:text-2xl text-foreground">
                Book Appoinement
              </h3>
              <div className="flex justify-start gap-2 pb-2 border-b border-primary">
                <Briefcase size={18} className="text-foreground" />
                <p className="text-sm text-foreground">Select Service</p>
              </div>
              <select
                value={selectedService?.id ?? ""}
                onChange={(e) => {
                  const found =
                    services.find((s) => s.id === e.target.value) ?? null;
                  setSelectedService(found);
                }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground"
              >
                <option value="">Basic Appointment</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ${s.price}
                  </option>
                ))}
              </select>
              <div className="flex justify-start gap-2 pb-2 border-b border-primary">
                <Calendar size={18} className="text-foreground" />
                <p className="text-sm text-foreground">Select Date</p>
              </div>
              <ContainerCalendar
                setIsLoading={setIsLoading}
                setAvailableAppointments={setAvailableAppointments}
                date={date}
                setDate={setDate}
                providerId={providerId}
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
                Confirm Appointment
              </MainButton>
            </div>
          </form>
        </Modal>
      </div>

      {showSuccess && (
        <SuccessModal
          date={date}
          selectedTime={selectedTime}
          provider={provider}
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showFailed && (
        <FailedModal isOpen={showFailed} onClose={() => setShowFailed(false)} />
      )}
    </>
  );
}
