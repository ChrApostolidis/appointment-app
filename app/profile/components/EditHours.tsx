"use client";
import { dayNames, orderedDayNames, WorkingHours } from "../data/hoursData";
import MainButton from "@/app/components/MainButton";
import Toggle from "./Toggle";
import { updateProviderWorkingHours } from "../actions/profileActions";

type EditHoursProps = {
  setWorkingHours: React.Dispatch<React.SetStateAction<WorkingHours>>;
  tempHours: WorkingHours;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTempHours: React.Dispatch<React.SetStateAction<WorkingHours>>;
};

export default function EditHours({
  setWorkingHours,
  tempHours,
  setIsModalOpen,
  setTempHours,
}: EditHoursProps) {
  const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = (i + 6).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleSave = async () => {
    try {
      await updateProviderWorkingHours(tempHours);
    } catch (error) {
      console.error("Failed to update working hours:", error);
    }
    setWorkingHours(structuredClone(tempHours));
    setIsModalOpen(false);
  };

  return (
    <>
      {orderedDayNames.map((day) => (
        <div
          key={day}
          className="lg:p-3 mb-2 flex items-center justify-between rounded-lg bg-muted/50 border border-border border-white rounded-2xl p-1 lg:p-4"
        >
          <div className="flex flex-col gap-1 lg:gap-4 lg:flex-row">
            <span className="font-medium text-sm text-foreground lg:text-xl">
              {dayNames[day]}
            </span>
            <Toggle
              setTempHours={setTempHours}
              day={day}
              enabled={tempHours[day].enabled}
            />
          </div>
          <div className="flex gap-1">
            <select
              value={tempHours[day].start}
              onChange={(e) => {
                setTempHours((prev) => ({
                  ...prev,
                  [day]: { ...prev[day], start: e.target.value },
                }));
              }}
              className="text-sm text-gray-400 lg:text-lg"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              value={tempHours[day].end}
              onChange={(e) => {
                setTempHours((prev) => ({
                  ...prev,
                  [day]: { ...prev[day], end: e.target.value },
                }));
              }}
              className="text-sm text-gray-400 lg:text-lg"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center mt-3 lg:px-10">
        <MainButton onClick={() => handleSave()} className="w-full">
          Save Changes
        </MainButton>
      </div>
    </>
  );
}
