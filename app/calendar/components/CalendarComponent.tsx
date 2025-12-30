"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
import { EventInput } from "@fullcalendar/core";

type Props = {
  events: EventInput[];
};

export default function CalendarComponent({ events }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: ""
      }}
      editable={false}
      selectable={false}
      height="auto"
    />
  );
}
