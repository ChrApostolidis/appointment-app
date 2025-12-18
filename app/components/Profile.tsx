"use client";

import { useEffect, useRef, useState } from "react";
import { userType } from "../registerForms/components/LockedRegisterForm";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LogOutButton from "@/auth/components/LogOutButton";
import ToggleTheme from "./ToggleTheme";

export default function Profile({ user }: { user: userType }) {
  const [openProfile, setOpenProfile] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node | null;
      if (openProfile && ref.current && t && !ref.current.contains(t)) {
        setOpenProfile(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [openProfile]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpenProfile((s) => !s)}
        className="bg-secondary cursor-pointer flex justify-center items-center border w-12 h-12 rounded-full mr-1  text-black"
        aria-expanded={openProfile}
        aria-haspopup="menu"
      >
        <p className="text-xl">{user.name?.charAt(0).toUpperCase()}</p>
      </button>

      <AnimatePresence>
        {openProfile && (
          <motion.div
            key="profile-menu"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              transition: { duration: 0.18, ease: "easeIn" },
            }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-3 mt-2 w-64 bg-background rounded-xl shadow-lg p-4 flex flex-col gap-2 border"
          >
           <div className="flex justify-between items-center">
              <p className="text-primary-foreground font-semibold">{user.name}</p>
              <ToggleTheme />
           </div>
            <p className="text-sm text-primary-foreground">{user.email}</p>
            <div className="mt-2 border-t pt-2">
              <Link
                href="/profile"
                className="block px-2 py-1 text-sm hover:bg-primary-hover rounded"
              >
                My Profile
              </Link>
              <Link
                href="/"
                className="block px-2 py-1 text-sm hover:bg-primary-hover rounded"
              >
                Dashboard
              </Link>
              <LogOutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
