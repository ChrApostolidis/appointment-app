"use client";

import { WorkingHours } from "@/app/profile/data/hoursData";
import { Calendar } from "@/components/ui/calendar";
import { startOfToday } from "date-fns";
import { weekdayIndex } from "../../utils/helper";
import { AppointmentSlot } from "./ConfirmBookingSection";
import { useEffect, useState } from "react";
import { getNextAvailableSlot } from "../../actions/actions";
import { getProviderClosedDates } from "@/app/profile/actions/profileActions";

type ContainerCalendarProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  providerId: string;
  workingHours: WorkingHours | undefined;
  setIsLoading: (loading: boolean) => void;
  setAvailableAppointments: (slots: AppointmentSlot[] | null) => void;
};

export default function ContainerCalendar({
  date,
  setDate,
  providerId,
  workingHours,
  setIsLoading,
  setAvailableAppointments,
}: ContainerCalendarProps) {
  const [closedDateObjects, setClosedDateObjects] = useState<Date[]>([]);

  useEffect(() => {
    getProviderClosedDates(providerId).then((dates) => {
      setClosedDateObjects(dates.map((d) => new Date(d + "T00:00:00")));
    });
  }, [providerId]);

  const fetchAppointments = async (providerId: string, date: Date) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/availability?providerId=${providerId}&date=${date.toISOString()}`,
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

  // On mount: if a date is pre-selected, check availability.
  // If the provider is closed or fully booked that day, fall back to the next available date.
  useEffect(() => {
    if (!date) return;

    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/availability?providerId=${providerId}&date=${date.toISOString()}`
        );
        if (!res.ok) throw new Error("Request failed");
        const data = (await res.json()) as { slots: AppointmentSlot[] | "Closed" };

        const unavailable =
          data.slots === "Closed" ||
          (Array.isArray(data.slots) && data.slots.length === 0);

        if (unavailable) {
          const nextSlot = await getNextAvailableSlot(providerId);
          if (nextSlot) {
            const next = new Date(nextSlot.startAt);
            const nextDay = new Date(next.getFullYear(), next.getMonth(), next.getDate());
            setDate(nextDay);
            const res2 = await fetch(
              `/api/availability?providerId=${providerId}&date=${nextDay.toISOString()}`
            );
            const data2 = (await res2.json()) as { slots: AppointmentSlot[] | "Closed" };
            setAvailableAppointments(data2.slots === "Closed" ? null : data2.slots);
          } else {
            setAvailableAppointments(null);
          }
        } else {
          setAvailableAppointments(data.slots as AppointmentSlot[]);
        }
      } catch (err) {
        console.error("Error during initial availability check:", err);
        setAvailableAppointments([]);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = startOfToday();

  if (!workingHours) {
   console.error("Working hours data is missing");  
    return null;
  }

  const disabledDays = Object.entries(workingHours)
    .filter(([, entry]) => entry.enabled === false)
    .map(([day]) => weekdayIndex(day)); // convert day names to (0-6) to pass to the calendar

  return (
    <div className="flex justify-center items-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          setDate(selectedDate || undefined);
          if (selectedDate) {
            fetchAppointments(providerId, selectedDate);
          }
        }}
        disabled={[{ before: today }, { dayOfWeek: disabledDays }, ...closedDateObjects]}
        required={false}
        className="rounded-md border shadow-sm bg-background text-foreground"
        captionLayout="dropdown"
      />
    </div>
  );
}
