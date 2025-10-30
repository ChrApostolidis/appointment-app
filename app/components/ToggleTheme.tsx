"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function ToggleTheme() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex justify-center items-center mx-5 w-15 h-12 border-1 rounded-full bg-[#a1b1b3]">
      <button
        className="cursor-pointer"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {mounted ? (
          <AnimatePresence mode="wait" initial={false}> 
            {resolvedTheme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, y: -10, rotate: -90 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 10, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center"
              >
                <Moon size={30} color="#90CAF9" />
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
                <Sun size={30} color="#FFD54F" />
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
