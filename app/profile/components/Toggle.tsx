import { WorkingHours } from "../data/hoursData";

type ToggleProps = {
  setTempHours: React.Dispatch<React.SetStateAction<WorkingHours>>;
  day: string;
  enabled: boolean;
};

export default function Toggle({ setTempHours, day, enabled }: ToggleProps) {
  const toggleDay = (day: string) => {
    setTempHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
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
