"use client";

import { Edit, Clock } from "lucide-react";
import MainButton from "@/app/components/MainButton";
import Toggle from "./Toggle";

// Dummy working hours data
const workingHoursData = [
  { day: "Monday", hours: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
  { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
  { day: "Friday", hours: "9:00 AM - 3:00 PM" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" },
];

export default function WorkingHours() {
  return (
    <div className="pt-6 border-t border-border bg-background">
      <div className="bg-background border border-border rounded-2xl shadow-lg p-2 pt-4 mb-6">
        <div className="bg-background">
          <div className="flex gap-2 justify-center items-center mb-2 lg:justify-start">
            <Clock className="w-6 h-6 text-primary" />
            <h1 className="lg:text-3xl text-2xl font-bold text-foreground">
              Working Hours
            </h1>
          </div>
        </div>
        <div className="flex-col justify-center items-center lg:flex lg:items-start">
          <div className="flex items-center mb-4 px-4 ">
            <p className="text-foreground">Manage your weekly availability</p>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <MainButton
            // onClick={handleEdit}
            className="flex items-center gap-2 hover:bg-indigo-700 text-foreground px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            Edit Hours
            <Edit className="w-5 h-5" />
          </MainButton>
        </div>
      </div>

      <div className="space-y-2">
        {workingHoursData.map((schedule, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex-col gap-5 lg:flex">
              <span className="font-medium text-sm text-foreground lg:text-xl">
                {schedule.day}
              </span>
              <Toggle />
            </div>
            <span
              className="text-sm text-foreground lg:text-lg"
            >
              {schedule.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
