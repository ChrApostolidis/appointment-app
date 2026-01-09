"use client";

import { motion } from "framer-motion";
import MainButton from "./MainButton";
import Image from "next/image";

export default function BookingMarketingComponent() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 px-6 py-12 shadow-2xl">
      <div
        aria-hidden
        className="absolute inset-y-0 left-6 hidden w-40 rounded-full bg-primary/20 blur-[120px] lg:block"
      />
      <div className="relative justify-center flex flex-col items-center gap-10 lg:flex-row lg:items-center">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/BookingImage.png"
            alt="Booking Marketing"
            width={600}
            height={900}
          />
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
