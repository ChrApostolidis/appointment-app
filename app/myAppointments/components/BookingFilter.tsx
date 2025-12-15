"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Fitlers = "All" | "Upcoming" | "Completed" | "Cancelled";

export default function BookingFilter() {
  const [plan, setPlan] = useState<Fitlers>("All");
  const tabs: Fitlers[] = ["All", "Upcoming", "Completed", "Cancelled"];
  return (
    <div className="flex lg:gap-2  border-solid border-2  border-primary rounded-2xl mb-2 lg:mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setPlan(tab)}
          className={`relative z-10 px-2 sm:px-3 lg:px-4
                    py-1.5 sm:py-2
                    text-xs sm:text-sm lg:text-2xl
                    font-medium
                    transition-colors
                    cursor-pointer
                ${plan === tab ? "text-black" : "text-primary"}
            `}
        >
          {plan === tab && (
            <motion.span
              layoutId="active-pill"
              className="absolute inset-0 rounded-lg bg-primary"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-20">{tab}</span>
        </button>
      ))}
    </div>
  );
}
