"use client";

import { CalendarDays, Clock8, Link2, Settings2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import StepperButton from "./StepperButton";

export type Step = "Calendar" | "Appointments" | "Availability" | "Services";

export default function EventsStepper() {
  const [step, setStep] = useState<Step>("Calendar");
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
          <StepperButton
            onClick={() => {
              setStep("Calendar");
            }}
            icon={<CalendarDays />}
            title="Built in Calendar"
          />
          <StepperButton
            onClick={() => {
              setStep("Appointments");
            }}
            icon={<Settings2 />}
            title="Check your Appointments real time"
          />
          <StepperButton
            onClick={() => {
              setStep("Availability");
            }}
            icon={<Clock8 />}
            title="Add your Availability"
          />
          <StepperButton
            onClick={() => {
                setStep("Services");
              }}
            icon={<Link2 />}
            title="Discover Services"
          />
        </div>
        <div className="bg-background border-border border rounded-lg p-10">
          <div className="bg-background border-border rounded-lg border p-10">
            {step === "Calendar" ? (
              <Image
                src="/AppCalendar.png"
                alt="App Calendar App Image"
                width={600}
                height={600}
              />
            ) : step === "Appointments" ? (
              <Image
                src="/WorkingHours.png"
                alt="Working Hours App Image"
                width={600}
                height={600}
              />
            ) : step === "Availability" ? (
              <Image
                src="/MyAppointments.png"
                alt="My Appointments App Image"
                width={600}
                height={600}
              />
            ) : step === "Services" ? (
              <Image
                src="/Providers.png"
                alt="Providers App Image"
                width={600}
                height={600}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
