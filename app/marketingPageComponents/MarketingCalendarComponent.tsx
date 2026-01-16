"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MarketingCalendarComponent() {
  return (
    <div className="py-30 relative overflow-hidden rounded-lg border border-primary/10 bg-gradient-to-br from-background via-background to-primary/40 px-6 py-12 shadow-2xl">
      <div
        aria-hidden
        className="absolute inset-y-0 right-6 hidden w-40 rounded-full bg-primary/20 blur-[120px] lg:block"
      />
      <div className="relative justify-center flex flex-col items-center gap-10 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex max-w-2xl mx-auto flex-col gap-6 text-center lg:text-left"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Sygned Calendar
          </span>
          <h3 className="text-3xl font-semibold text-foreground lg:text-4xl">
            Built-in. Not bolted on.
          </h3>
          <p className="text-base text-muted-foreground lg:text-lg">
            AppointMe comes with a fully built-in calendar, so you don’t have to
            rely on external tools. Manage appointments and bookings
            seamlessly—all in one place.
          </p>
        </motion.div>
        <motion.div
          className="flex justify-center bg-gradient-to-bl from-background via-background to-primary/40 p-10 rounded-lg border border-primary/20"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="bg-background border-primary/20 rounded-lg border p-10 overflow-hidden relative lg:h-124 lg:w-164">
            <Image
              src="/MarketingCalendar.png"
              alt="Reminder Preview"
              width={600}
              height={600}
              className="h-auto w-full select-none"
              draggable={false}
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
