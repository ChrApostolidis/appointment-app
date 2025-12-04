
import { StoredWeeklyHours } from "@/drizzle/schema";
import { dayNames, orderedDayNames } from "../data/hoursData";

export default function Hours({ data }: { data: StoredWeeklyHours }) {
  return (
    <>
      {orderedDayNames.map((day) => (
        <div
          key={day}
          className={`lg:p-3 mb-2 flex items-center justify-between rounded-lg ${
            data[day].enabled ? "border-primary" : "border-red"
          } border rounded-2xl p-1 lg:p-4`}
        >
          <div className="flex flex-col gap-1 lg:gap-4 lg:flex-row">
            <span className="font-medium text-sm text-foreground lg:text-xl">
              {dayNames[day]} 
            </span>
          </div>
          <span className="text-sm text-foreground lg:text-lg">
            {data[day].start} - {data[day].end}
          </span>
        </div>
      ))}
    </>
  );
}
