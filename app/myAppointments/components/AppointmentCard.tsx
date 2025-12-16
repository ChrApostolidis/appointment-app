import { Calendar, CircleUser, Clock8, MapPin } from "lucide-react";
import MainButton from "../../components/MainButton";
import { Bookings } from "../actions/actions";
import { formatTime } from "@/app/book/utils/helper";

export default function AppointmentCard({
  bookings,
}: {
  bookings: Bookings[];
}) {
  type BookingStatus = "Upcoming" | "Completed" | "Cancelled";
  const statusColorMap: Record<BookingStatus, string> = {
    Upcoming: "bg-orange-400",
    Completed: "bg-green-400",
    Cancelled: "bg-red-400",
  };
  const status = bookings[0].status as BookingStatus;
  return (
    <div className="mt-4 bg-foreground w-[90%] lg:max-w-xl lg:w-full p-3 rounded-xl">
      <div className="flex justify-between">
        <p className="text-background font-bold text-lg">{bookings[0].name}</p>
        <p
          className={`${
            statusColorMap[status] || "bg-gray-400"
          } rounded-full px-2 py-1 text-black text-xs`}
        >
          {bookings[0].status}
        </p>
      </div>
      <div className="flex gap-2 mb-4">
        <CircleUser fontSize={14} className="text-background/40" />
        <p className="text-background/40">{bookings[0].businessName}</p>
      </div>
      <div className="my-5 flex flex-col lg:flex-row gap-2 lg:gap-4 lg:justify-between">
        <div className="flex gap-1">
          <Clock8 fontSize={14} className="text-background" />
          <p className="text-background">
            {formatTime(bookings[0].startAt)} - {formatTime(bookings[0].endAt)}
          </p>
        </div>
        <div className="flex gap-1">
          <Calendar fontSize={14} className="text-background" />
          <p className="text-background">
            {bookings[0].startAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1">
          <MapPin fontSize={14} className="text-background" />
          <p className="text-background">Thessaloniki</p>
        </div>
      </div>
      <div className="w-full">
        <MainButton className="w-full mt-4">Reschedule</MainButton>
      </div>
    </div>
  );
}
