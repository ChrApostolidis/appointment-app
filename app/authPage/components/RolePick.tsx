"use client";

import { motion } from "framer-motion";

interface ToggleButtonProps {
  value?: "user" | "provider";
  onChange?: (role: "user" | "provider") => void;
}

export function RolePick({ value, onChange }: ToggleButtonProps) {
  return (
    <div className="flex justify-center items-center mb-3">
      <div className="w-[200px] relative flex bg-primary rounded-full shadow-md p-1">
        <motion.div
          layout
          initial={false}
          animate={{ x: value === "user" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-secondary rounded-full"
        />

        <button
          type="button"
          onClick={() => onChange?.("user")}
          className={`cursor-pointer relative z-10 w-24 py-2 text-sm font-medium rounded-full ${
            value === "user" ? "text-white" : "text-gray-500"
          }`}
        >
          User
        </button>

        <button
          type="button"
          onClick={() => onChange?.("provider")}
          className={`cursor-pointer relative z-10 w-24 py-2 text-sm font-medium rounded-full ${
            value === "provider" ? "text-white" : "text-gray-500"
          }`}
        >
          Provider
        </button>
      </div>
    </div>
  );
}
