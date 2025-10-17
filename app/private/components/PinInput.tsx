"use client";

import {
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { motion } from "framer-motion";

interface PinInputProps {
  length: number;
  onComplete?: (pin: string) => void;
}

export default function PinInput({ length, onComplete }: PinInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) => {
    inputsRef.current[i]?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const digit = e.target.value.replace(/\D/g, "").slice(0, 1);
    if (!digit) return;

    const newVals = [...values];
    newVals[i] = digit;
    setValues(newVals);

    // Check if this was the last digit
    if (i === length - 1 && digit && onComplete) {
      // Call onComplete with the full PIN
      onComplete(newVals.join(""));
    } else if (i < length - 1) {
      focusAt(i + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newVals = [...values];

      if (newVals[i]) {
        newVals[i] = "";
        setValues(newVals);
      } else if (i > 0) {
        newVals[i - 1] = "";
        setValues(newVals);
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusAt(i - 1);
    } else if (e.key === "ArrowRight" && i < length - 1) {
      focusAt(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length)
      .split("");

    if (!pasted.length) return;

    const newVals = Array(length)
      .fill("")
      .map((_, idx) => pasted[idx] || "");
    setValues(newVals);
    focusAt(Math.min(pasted.length, length - 1));
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  return (
    <motion.div
      className="flex gap-3 justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={setInputRef(i)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={values[i]}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-lg bg-gray-800 text-white rounded-xl border border-gray-600 mt-5 focus:outline-none focus:border-green-400 transition-all duration-200"
          whileFocus={{
            scale: 1.1,
            borderColor: "#1c35a3",
            boxShadow: "0 0 8px #1c35a3",
          }}
          whileTap={{ scale: 0.95 }}
        />
      ))}
    </motion.div>
  );
}
