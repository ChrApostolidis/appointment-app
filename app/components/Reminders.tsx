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
            We handle notifications so you never miss an appointment. Clients receive instant booking confirmations
            plus timed reminders that match their time zone.
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto h-80 w-48 p-3 sm:h-[30rem] sm:w-60"
        >
          <div className="relative h-full w-full rounded-[2rem] overflow-hidden">
            <Image
              src="/ReminderImage.png"
              alt="Phone with Notification"
              fill
              sizes="(min-width: 1024px) 15rem, (min-width: 640px) 14rem, 12rem"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
