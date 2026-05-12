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
    <>
      <div className="sm:hidden w-[92vw] max-w-md grid grid-cols-2 gap-2 mb-3">
        {TABS.map((tab) => {
          const isActive = currentTab === tab;
          return (
            <Link
              key={tab}
              href={buildHref(tab)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={`${tab === "All" ? "col-span-2" : ""}
                flex items-center justify-center gap-1.5
                px-3 py-2 text-sm font-medium rounded-full
                border-2 border-primary transition-colors
                ${
                  isActive
                    ? "bg-primary text-black"
                    : "bg-transparent text-primary"
                }`}
            >
              <span>{tab}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden sm:flex flex-nowrap items-center justify-center gap-1 lg:gap-2 border-solid border-2 border-primary rounded-2xl mb-2 lg:mb-6">
        {TABS.map((tab) => {
          const isActive = currentTab === tab;
          return (
            <Link
              key={tab}
              href={buildHref(tab)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={`relative z-10 shrink-0 whitespace-nowrap
                      px-3 lg:px-4 py-2
                      text-sm lg:text-2xl
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
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
