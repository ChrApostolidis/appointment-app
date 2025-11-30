"use client";

import { dayNames } from "../data/hoursData";
import { useHoursForms } from "../hooks/useHoursForms";

export default function Hours() {
  const { workingHours } = useHoursForms();

  return (
    <>
      {Object.keys(workingHours).map((day, index) => (
        <div
          key={index}
          className={`lg:p-3 mb-2 flex items-center justify-between rounded-lg ${
            workingHours[day].enabled ? "border-primary" : "border-red"
          } border rounded-2xl p-1 lg:p-4`}
        >
          <div className="flex flex-col gap-1 lg:gap-4 lg:flex-row">
            <span className="font-medium text-sm text-foreground lg:text-xl">
              {dayNames[day]}
            </span>
          </div>
          <span className="text-sm text-foreground lg:text-lg">
            {workingHours[day].start} - {workingHours[day].end}
          </span>
        </div>
      ))}
    </>
  );
}
