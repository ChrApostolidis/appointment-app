"use client";
import { motion, AnimatePresence } from "framer-motion";

import ProgressBar from "./ProgressBar";

type StepperButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  progress: number;
  text: string;
};

export default function StepperButton({
  onClick,
  icon,
  title,
  isActive,
  progress,
  text,
}: StepperButtonProps) {
  return (
    <motion.div
      className={`relative w-full text-foreground py-6 border-b border-gray-600`}
    >
      <motion.div>
        <button
          onClick={onClick}
          className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-primary" : "text-gray-400"}`}
        >
          {icon}
          <h3 className={`text-2xl ${isActive ? "text-foreground font-bold" : "text-gray-400"}`}>{title}</h3>
        </button>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ y: -6 }}
                animate={{ y: 0 }}
                exit={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <div className="w-[40rem] text-left">
                  <p>{text}</p>
                </div>

                <ProgressBar progress={progress} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
