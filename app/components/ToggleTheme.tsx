"use client";

import { Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-center items-center w-12 h-10 border rounded-full bg-background">
      <button
        className="cursor-pointer"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        {mounted ? (
          <AnimatePresence mode="wait" initial={false}>
            {theme === "light" ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, y: -10, rotate: -90 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 10, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center"
              >
                <Moon size={25} color="#90CAF9" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, y: 10, rotate: 90 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -10, rotate: -90 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center"
              >
                <Sun size={25} color="#FFD54F" />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <Image
            src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
            width={36}
            height={36}
            sizes="36x36"
            alt="Loading Light/Dark Toggle"
            priority={false}
            title="Loading Light/Dark Toggle"
          />
        )}
      </button>
    </div>
  );
}
