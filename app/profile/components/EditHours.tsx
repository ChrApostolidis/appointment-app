import { dayNames} from "../data/hoursData";
import { useHoursForms } from "../hooks/useHoursForms";
// import Toggle from "./Toggle";
import MainButton from "@/app/components/MainButton";

export default function EditHours() {
  const { handleSave, workingHours } = useHoursForms();

  const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = (i + 6).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <>
      {Object.keys(workingHours).map((day, index) => (
        <div
          key={index}
          className="lg:p-3 mb-2 flex items-center justify-between rounded-lg bg-muted/50 border border-border border-white rounded-2xl p-1 lg:p-4"
        >
          <div className="flex flex-col gap-1 lg:gap-4 lg:flex-row">
            <span className="font-medium text-sm text-foreground lg:text-xl">
              {dayNames[day]}
            </span>
            {/* <Toggle /> */}
          </div>
          <div className="flex gap-1">
            <select className="text-sm text-gray-400 lg:text-lg">
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select className="text-sm text-gray-400 lg:text-lg">
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
