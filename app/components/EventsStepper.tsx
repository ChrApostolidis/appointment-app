"use client";

import { CalendarDays, Clock8, Link2, Settings2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import StepperButton from "./StepperButton";

export const steps = [
  {
    id: 0,
    title: "Built in Calendar",
    text: "Easily view and manage your appointments with our integrated calendar feature.",
    icon: <CalendarDays size={25} />,
    image: "/BuiltInCalendar.png",
  },
  {
    id: 1,
    title: "Check your Appointments",
    text: "Stay updated with real-time notifications for all your upcoming appointments.",
    icon: <Settings2 size={25} />,
    image: "/CheckAppointments.png",
  },
  {
    id: 2,
    title: "Add your Availability",
    text: "Set and manage your working hours to let clients know when you're available.",
    icon: <Clock8 size={25} />,
    image: "/WorkingHours.png",
  },
  {
    id: 3,
    title: "Discover Providers",
    text: "Find and connect with providers that match your needs and preferences.",
    icon: <Link2 size={25} />,
    image: "/Providers.png",
  },
] as const;

export default function EventsStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Progress timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // Step change when progress completes
  useEffect(() => {
    if (progress === 100) {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }
  }, [progress]);

  //  Manual click resets progress
  const handleStepClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

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

      <div className="flex flex-col lg:flex-row gap-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {steps.map((step) => (
            <StepperButton
              key={step.id}
              text={step.text}
              onClick={() => handleStepClick(step.id)}
              isActive={activeIndex === step.id}
              icon={step.icon}
              title={step.title}
              progress={progress}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block bg-background border-border border rounded-lg p-10"
        >
          <div className="bg-background border-border rounded-lg border p-10 overflow-hidden relative lg:h-124 lg:w-164">
            <AnimatePresence mode="wait">
              <motion.img
                key={steps[activeIndex].image}
                src={steps[activeIndex].image}
                alt={steps[activeIndex].title}
                className="absolute inset-0 w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
