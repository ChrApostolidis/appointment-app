import { WorkingHours } from "@/app/profile/data/hoursData";
import { Calendar } from "@/components/ui/calendar";
import { startOfToday } from "date-fns";
import { weekdayIndex } from "../../utils/helper";

type ContainerCalendarProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  fetchAppoinements: (providerId: string, date: Date) => Promise<void>;
  providerId: string;
  workingHours: WorkingHours;
};

export default function ContainerCalendar({
  date,
  setDate,
  fetchAppoinements,
  providerId,
  workingHours,
}: ContainerCalendarProps) {
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
            fetchAppoinements(providerId, selectedDate);
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
