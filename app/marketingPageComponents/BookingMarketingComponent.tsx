"use client";

import { motion } from "framer-motion";
import MainButton from "../components/MainButton";
import Image from "next/image";

export default function BookingMarketingComponent() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-bl from-background via-background to-primary/40 px-6 py-12 shadow-2xl">
      <div
        aria-hidden
        className="absolute inset-y-0 left-6 hidden w-40 rounded-full bg-primary/20 blur-[120px] lg:block"
      />
      <div className="relative justify-center flex flex-col items-center gap-35 lg:flex-row lg:items-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/ProviderImageBase.png"
                alt="Booking Marketing"
                width={500}
                height={700}
                className="h-auto w-full select-none"
                draggable={false}
                priority
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, filter: "brightness(0.4)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 top-0 w-full -translate-x-1/2"
            >
              <Image
                src="/ProviderImageScreen.png"
                alt="Booking Marketing Phone"
                width={400}
                height={600}
                className="h-auto w-full"
                draggable={false}
                priority
              />
            </motion.div>
          </div>
        </motion.div>
        <div className="relative justify-center flex flex-col items-center gap-10 lg:flex-row lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex max-w-2xl mx-auto flex-col gap-6 text-center lg:text-right"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Booking
            </span>
            <h3 className="text-3xl font-semibold text-foreground lg:text-4xl">
              Make online bookings 24/7
            </h3>
            <p className="text-base text-muted-foreground lg:text-lg">
              Customers can book appointments anytime. Simply set your working
              hours, and we take care of everything else.
            </p>
            <div className="flex justify-end lg:w-40 lg:self-end">
              <MainButton className="w-full" variant="primary">
                Get Started
              </MainButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
