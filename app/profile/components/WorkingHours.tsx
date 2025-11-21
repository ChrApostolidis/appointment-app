import { Edit, Clock } from "lucide-react";
import MainButton from "@/app/components/MainButton";

// Dummy working hours data
const workingHoursData = [
  { day: "Monday", hours: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
  { day: "Friday", hours: "9:00 AM - 3:00 PM" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" },
]


export default function WorkingHours() {
  return (
    <div className="pt-6 border-t border-border animate-fade-in-delay">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            Working Hours
          </h2>
        </div>
        <MainButton variant="secondary" className="mt-4 lg:mt-20">
          <div className="flex justify-center items-center gap-2">
            Edit Profile
            <Edit className="w-5 h-5" />
          </div>
        </MainButton>
      </div>

      <div className="space-y-2">
        {workingHoursData.map((schedule, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="font-medium text-foreground">
              {schedule.day}
            </span>
            <span
              className={`text-sm
                  ? "text-muted-foreground"
                  : "text-destructive"
              }`}
            >
              {schedule.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
