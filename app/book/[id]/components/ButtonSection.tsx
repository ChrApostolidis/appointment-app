"use client";
import MainButton from "@/app/components/MainButton";
import Modal from "@/app/profile/components/Modal";
import ContainerCalendar from "./ContainerCalendar";
import { Calendar, Clock2 } from "lucide-react";
import { useState } from "react";
import { formatTime } from "../../utils/helper";
import { WorkingHours } from "@/app/profile/data/hoursData";

export type AppointmentSlot = {
  startAt: Date;
  endAt: Date;
};

export default function ButtonSection({
  providerId,
  workingHours,
}: {
  providerId: string;
  workingHours: WorkingHours;
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

  const fetchAppoinements = async (providerId: string, date: Date) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/availability?providerId=${providerId}&date=${date.toISOString()}`
      );
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as {
        slots: AppointmentSlot[] | "Closed";
      };
      setAvailableAppointments(data.slots === "Closed" ? null : data.slots);
    } catch (err) {
      setAvailableAppointments([]);
      console.log("Error fetching available appointments:", err);
    } finally {
      setIsLoading(false);
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
        <form>
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
              fetchAppoinements={fetchAppoinements}
              providerId={providerId}
              workingHours={workingHours}
            />
            <div className="flex justify-start gap-2 pb-2 border-b border-primary">
              <Clock2 size={18} className="text-foreground" />
              <p className="text-sm text-foreground">Select Time</p>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center text-lg">
                Loading available appointments...
              </div>
            ) : (
              <div className="flex">
                {availableAppointments ? (
                  <div className="flex gap-2 flex-wrap">
                    {availableAppointments.map((slot) => {
                      const start = new Date(slot.startAt);
                      const end = new Date(slot.endAt);
                      return (
                        <div
                          key={slot.startAt.toString()}
                          onClick={() => { setSelectedTime(slot); setIsDisabled(false); }}
                          className={`${
                            selectedTime?.startAt === slot.startAt
                              ? "bg-primary text-black"
                              : "bg-background text-foreground"
                          } p-1 rounded-lg hover:bg-primary hover:text-black cursor-pointer border border-border`}
                        >
                          <div className="flex">
                            <button type="button">{formatTime(start)}</button>
                            {" - "}
                            <button type="button">{formatTime(end)}</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>Please select a date to see available appointments.</div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center mt-3 border-t border-primary pt-4">
            <MainButton type="submit" disabled={isDisabled}>Confirm Appointment</MainButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
