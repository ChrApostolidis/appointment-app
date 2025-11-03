"use client";

import { ArrowRight, Zap, CreditCard } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HeroSection() {
  const [move, setMove] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 mb-8"
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">
            Smart Scheduling Made Simple
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
          Connect.
          <motion.span
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="block bg-linear-to-r from-cyan-400 to-cyan-600 text-transparent bg-clip-text"
          >
            Book.
          </motion.span>
          Get it done.
        </h1>

        <p
          className="text-xl md:text-2xl mb-12 text-gray-400 dark:text-gray-600 
                     max-w-3xl mx-auto"
        >
          Discover trusted professionals, from doctors to developers. Schedule
          appointments that fit your time — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            onClick={() => setMove(!move)}
            href="/authPage"
            className="bg-primary cursor-pointer hover:bg-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            Get Started Free
            <motion.div
              animate={{ x: move ? 200 : 0, opacity: move ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
          <button className="cursor-pointer px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
            Watch Demo
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-muted">
          <CreditCard className="w-5 h-5" />
          <p className="text-sm text-gray-500">No credit card required</p>
        </div>
      </div>
    </div>
  );
}
