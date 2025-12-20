"use client";

import { motion } from "framer-motion";
import { Filters } from "./MainSection";

export default function BookingFilter({
  filter,
  setFilter,
}: {
  filter: Filters;
  setFilter: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const tabs: Filters[] = [
    "All",
    "Pending",
    "Upcoming",
    "Completed",
    "Cancelled",
  ];
  return (
    <div className="flex lg:gap-2  border-solid border-2  border-primary rounded-2xl mb-2 lg:mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setFilter(tab)}
          className={`relative z-10 px-2 sm:px-3 lg:px-4
                    py-1.5 sm:py-2
                    text-xs sm:text-sm lg:text-2xl
                    font-medium
                    transition-colors
                    cursor-pointer
                ${filter === tab ? "text-black" : "text-primary"}
            `}
        >
          {filter === tab && (
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
