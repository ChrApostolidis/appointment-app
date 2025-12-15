import { Calendar, CircleUser, Clock8, MapPin } from "lucide-react";
import MainButton from "../../components/MainButton";

export default function AppointmentCard() {
  return (
    <div className="mt-4 bg-foreground w-[90%] lg:max-w-xl lg:w-full p-3 rounded-xl">
      <div className="flex justify-between">
        <p className="text-background font-bold text-lg">Bussiness Name</p>
        <p className="bg-green-400 rounded-full px-2 py-1 text-black text-xs">
          Completed
        </p>
      </div>
      <div className="flex gap-2 mb-4">
        <CircleUser fontSize={14} className="text-background/40" />
        <p className="text-background/40">Name</p>
      </div>
      <div className="my-5 flex flex-col lg:flex-row gap-2 lg:gap-4 lg:justify-between">
        <div className="flex">
          <Clock8 fontSize={14} className="text-background" />
          <p className="text-background">Time</p>
        </div>
        <div className="flex">
          <Calendar fontSize={14} className="text-background" />
          <p className="text-background">Date</p>
        </div>
        <div className="flex">
          <MapPin fontSize={14} className="text-background" />
          <p className="text-background">Location</p>
        </div>
      </div>
      <div className="w-full">
        <MainButton className="w-full mt-4">Reschedule</MainButton>
      </div>
    </div>
  );
}
