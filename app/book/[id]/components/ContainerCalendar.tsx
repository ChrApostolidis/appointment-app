import { WorkingHours } from "@/app/profile/data/hoursData";
import { Calendar } from "@/components/ui/calendar";
import { startOfToday } from "date-fns";
import { weekdayIndex } from "../../utils/helper";
import { AppointmentSlot } from "./ButtonSection";

type ContainerCalendarProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  providerId: string;
  workingHours: WorkingHours;
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
  
  const fetchAppointments = async (providerId: string, date: Date) => {
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

  const today = startOfToday();

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
        disabled={[{ before: today }, { dayOfWeek: disabledDays }]}
        required={false}
        className="rounded-md border shadow-sm bg-background text-foreground"
        captionLayout="dropdown"
      />
    </div>
  );
}
