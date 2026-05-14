import { formatTime } from "../../utils/helper";
import { AppointmentSlot } from "./ConfirmBookingSection";

export type AppoinementProps = {
  selectedTime: AppointmentSlot | undefined;
  setSelectedTime: (slot: AppointmentSlot) => void;
  availableAppointments: AppointmentSlot[] | null;
  isLoading: boolean;
  setIsDisabled: (disabled: boolean) => void;
};

export default function Appoinements({
  selectedTime,
  setSelectedTime,
  availableAppointments,
  isLoading,
  setIsDisabled,
}: AppoinementProps) {

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center text-lg">
          Loading available appointments...
        </div>
      ) : (
        <div className="w-full">
          {availableAppointments ? (
            <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
              {availableAppointments.map((slot) => {
                const start = new Date(slot.startAt);
                const end = new Date(slot.endAt);
                return (
                  <div
                    key={slot.startAt.toString()}
                    onClick={() => {
                      setSelectedTime(slot);
                      setIsDisabled(false);
                    }}
                    className={`${
                      selectedTime?.startAt === slot.startAt
                        ? "bg-primary text-black"
                        : "bg-background text-foreground"
                    } px-2 py-1.5 rounded-lg hover:bg-primary hover:text-black cursor-pointer border border-border text-center`}
                  >
                    <div className="flex justify-center">
                      <button type="button">{formatTime(start)}</button>
                      {" - "}
                      <button type="button">{formatTime(end)}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>Please select a date to see available appointments.</div>
          )}
        </div>
      )}
    </>
  );
}
