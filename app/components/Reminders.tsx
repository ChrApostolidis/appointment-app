"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const highlights = [
  "Instant confirmations",
  "Smart time zones",
  "Email + SMS nudges",
  "Provider follow-ups",
];

export default function Reminders() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 px-6 py-12 shadow-2xl">
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
            Notifications
          </span>
          <h3 className="text-3xl font-semibold text-foreground lg:text-4xl">
            Automatic reminders for you and your clients
          </h3>
          <p className="text-base text-muted-foreground lg:text-lg">
            We handle notifications so you never miss an appointment. Clients
            receive instant booking confirmations plus timed reminders that
            match their time zone.
          </p>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                className="rounded-2xl border border-primary/10 bg-background/70 px-4 py-3 text-sm font-medium text-foreground shadow-sm"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]">
            <Image
              src="/ReminderImageBase.png"
              alt="Reminder Preview"
              width={500}
              height={700}
              className="h-auto w-full select-none"
              draggable={false}
              priority
            />
            <Image
              src="/ReminderImageScreen.png"
              alt="Reminder Screen"
              width={400}
              height={600}
              className="absolute left-1/2 top-[0%] h-auto w-[100%] -translate-x-1/2 rounded-2xl shadow-2xl"
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
