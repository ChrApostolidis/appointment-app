import Toggle from "./Toggle";

export const workingHoursData = [
  { day: "Monday", hours: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
  { day: "Friday", hours: "9:00 AM - 3:00 PM" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" },
];

export default function Hours() {
  return (
    <>
      {workingHoursData.map((schedule, index) => (
        <div
          key={index}
          className="lg:p-3 mb-2 flex items-center justify-between rounded-lg bg-muted/50 border border-border border-white rounded-2xl p-1 lg:p-4"
        >
          <div className="flex flex-col gap-1 lg:gap-4 lg:flex-row">
            <span className="font-medium text-sm text-foreground lg:text-xl">
              {schedule.day}
            </span>
            <Toggle />
          </div>
          <span className="text-sm text-foreground lg:text-lg">
            {schedule.hours}
          </span>
        </div>
      ))}
    </>
  );
}
