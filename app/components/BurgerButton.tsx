"use client"

import { motion } from "framer-motion";
import { useState } from "react";

export default function BurgerButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-secondary rounded-2xl hover:cursor-pointer flex items-center justify-center p-1 m-2 lg:hidden">
      <button
        onClick={() => setMenuOpen(() => !menuOpen)}
        className="w-10 h-10 flex items-center justify-center relative lg:hidden"
      >
        <span className="relative w-6 h-6">
          <motion.span
            style={{ transformOrigin: "center" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block h-0.5 w-6 bg-white rounded"
            animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            style={{ transformOrigin: "center" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block h-0.5 w-6 bg-white rounded"
            animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          />
        </span>
      </button>
    </div>
  );
}
