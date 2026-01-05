"use client";

import { MapIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function EventsStepper() {
    const [] = useState(false);
  return (
    <div className="flex flex-col justify-center items-center px-5 py-5 gap-4 text-center">
      <h2 className="font-bold text-2xl lg:text-3xl text-primary">
        Here’s what AppointMe can do for you!
      </h2>
      <p className="font-bold text-xl lg:text-2xl">
        One platform to find the services you need.
      </p>
      <p className="text-xl lg:text-2xl">
        Easily schedule and manage all your appointments in one place.
      </p>

      <div className="flex flex-row lg:flex gap-10">
        <div className="">
          <div className="text-foreground py-6 border-border border-b pr-40">
            <button className="flex items-center gap-2 cursor-pointer">
              <MapIcon />
              <h3 className="text-2xl">Built in Calendar</h3>
            </button>
          </div>
          <div className="text-foreground py-6 border-border border-b pr-40">
            <button className="flex items-center gap-2 cursor-pointer">
              <MapIcon />
              <h3 className="text-2xl">Check your Appointments real time</h3>
            </button>
          </div>
          <div className="text-foreground py-6 border-border border-b pr-40">
            <button className="flex items-center gap-2 cursor-pointer">
              <MapIcon />
              <h3 className="text-2xl">Add your Availability</h3>
            </button>
          </div>
         <div className="text-foreground py-6 border-border border-b pr-40">
            <button className="flex items-center gap-2 cursor-pointer">
              <MapIcon />
              <h3 className="text-2xl">Discover Services</h3>
            </button>
          </div>
        </div>
        <div className="bg-background border-border border rounded-lg p-10">
          <div className="bg-background border-border rounded-lg border p-10">
            <Image
              src="/AppCalendar.png"
              alt="App Calendar"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
