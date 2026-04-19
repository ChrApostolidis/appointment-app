import { WorkingHours } from "../data/hoursData";

type ToggleProps = {
  setTempHours: React.Dispatch<React.SetStateAction<WorkingHours>>;
  day: string;
  enabled: boolean;
};

export default function Toggle({ setTempHours, day, enabled }: ToggleProps) {
  const toggleDay = (day: string) => {
    setTempHours((prev) => {
      const current = prev[day];
      const turningOn = !current.enabled;
      return {
        ...prev,
        [day]: {
          ...current,
          enabled: turningOn,
          start: turningOn && current.start === "Closed" ? "09:00" : current.start,
          end: turningOn && current.end === "Closed" ? "17:00" : current.end,
        },
      };
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggleDay(day)}
        className={`w-12 h-6 rounded-full transition-colors duration-300 ${
          enabled ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        ></div>
      </button>
    </div>
  );
}
