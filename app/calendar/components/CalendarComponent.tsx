"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventInput } from "@fullcalendar/core";
import { useEffect, useRef, useState } from "react";

type Props = {
  events: EventInput[];
};

export default function CalendarComponent({ events }: Props) {
  const fullCalendarRef = useRef<FullCalendar | null>(null);
  const [view, setView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("dayGridMonth");

  type BookingStatus = "Pending" | "Upcoming" | "Completed" | "Cancelled";

  const statusColorMap: Record<BookingStatus, string> = {
    Pending: "bg-yellow-400",
    Upcoming: "bg-orange-400",
    Completed: "bg-green-400",
    Cancelled: "bg-red-400",
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setView("timeGridDay");
    }
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <FullCalendar
      ref={fullCalendarRef}
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView={view}
      events={events}
      windowResize={() => {
        if (!fullCalendarRef.current) return;
        
        const calendarApi = fullCalendarRef.current.getApi();

        if (window.innerWidth < 768) {
          calendarApi.changeView("timeGridDay");
          setView("timeGridDay");
        } else {
          calendarApi.changeView("dayGridMonth");
          setView("dayGridMonth");
        }
      }}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right:
          view === "timeGridDay" ? "" : "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      editable={false}
      selectable={false}
      height="auto"
      eventContent={({ event }) => {
        if (event.extendedProps.status === "Cancelled") return null;
        const status = event.extendedProps.status as BookingStatus;
        return (
          <div
            className={`text-black group flex w-full flex-col gap-1 rounded-lg border border-white/20 px-2 py-1 shadow-sm transition hover:scale-[1.01] ${
              statusColorMap[status] || "bg-slate-500"
            }`}
          >
            <p className="text-xs font-semibold leading-tight">{event.title}</p>
            <p className="text-[11px] font-medium tracking-tight opacity-90">
              {formatTime(event.start)}
              {event.end ? ` – ${formatTime(event.end)}` : ""}
            </p>
            <span className="px-2 text-[10px] font-semibold uppercase">
              {status}
            </span>
          </div>
        );
      }}
    />
  );
}
