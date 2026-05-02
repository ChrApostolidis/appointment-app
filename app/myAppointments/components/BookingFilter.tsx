"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AppointmentStatusTab,
  StatusCounts,
} from "../actions/actions";

const TABS: AppointmentStatusTab[] = [
  "All",
  "Pending",
  "Upcoming",
  "Completed",
  "Cancelled",
];

export default function BookingFilter({
  currentTab,
  statusCounts,
}: {
  currentTab: AppointmentStatusTab;
  statusCounts: StatusCounts;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (tab: AppointmentStatusTab) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", tab);
    params.delete("page");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className="flex flex-wrap justify-center lg:gap-2 border-solid border-2 border-primary rounded-2xl mb-2 lg:mb-6">
      {TABS.map((tab) => {
        const count = statusCounts[tab];
        const isActive = currentTab === tab;
        return (
          <Link
            key={tab}
            href={buildHref(tab)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`relative z-10 px-2 sm:px-3 lg:px-4
                    py-1.5 sm:py-2
                    text-xs sm:text-sm lg:text-2xl
                    font-medium
                    transition-colors
                    cursor-pointer
                ${isActive ? "text-black" : "text-primary"}
            `}
          >
            {isActive && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-20 inline-flex items-center gap-1.5">
              {tab}
              {count > 0 && (
                <span
                  className={`text-[0.55em] lg:text-[0.5em] font-semibold leading-none px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-black/15 text-black"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  {count}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
