import { Calendar } from "@/components/ui/calendar";

export default function ContainerCalendar({
  date,
  setDate,
  fetchAppoinements,
  providerId,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  fetchAppoinements: (providerId: string, date: Date) => Promise<void>;
  providerId: string;
}) {
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
        required={false}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />
    </div>
  );
}
