"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { userType } from "../registerForms/components/LockedRegisterForm";
import LogOutButton from "@/auth/components/LogOutButton";
import ToggleTheme from "./ToggleTheme";

interface MobileDrawerProps {
  user: userType | null;
  isOpen: boolean;
  onClose: () => void;
}

interface DrawerLink {
  name: string;
  link: string;
}

function getNavLinks(user: userType | null): DrawerLink[] {
  if (user?.role === "user") {
    return [
      { name: "My Appointments", link: "/myAppointments" },
      { name: "Book", link: "/book" },
      { name: "Calendar", link: "/calendar" },
    ];
  }
  if (user?.role === "provider") {
    return [
      { name: "My Appointments", link: "/myAppointments" },
      { name: "Services", link: "/providerServices" },
      { name: "Calendar", link: "/calendar" },
    ];
  }
  return [];
}

export default function MobileDrawer({ user, isOpen, onClose }: MobileDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const navLinks = getNavLinks(user);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
          <motion.aside
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 z-50 h-full w-72 max-w-[85%] bg-second-background shadow-2xl flex flex-col lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex justify-between items-center h-20 px-4 border-b">
              <p className="text-lg font-semibold">Menu</p>
              <div className="flex items-center gap-2">
                <ToggleTheme />
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="bg-secondary flex justify-center items-center border w-12 h-12 rounded-full text-black">
                      <p className="text-xl">
                        {user.name?.charAt(0).toUpperCase()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground font-semibold truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {navLinks.length > 0 && (
                    <nav>
                      <ul className="flex flex-col gap-1">
                        {navLinks.map(({ name, link }) => (
                          <li key={name}>
                            <Link
                              href={link}
                              onClick={onClose}
                              className="block px-2 py-2 text-base text-foreground hover:text-primary transition-colors rounded"
                            >
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}

                  <div className="border-t pt-4 flex flex-col gap-1">
                    <Link
                      href="/profile"
                      onClick={onClose}
                      className="block px-2 py-2 text-base text-foreground hover:text-primary transition-colors rounded"
                    >
                      My Profile
                    </Link>
                    {user.role === "provider" && (
                      <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="block px-2 py-2 text-base text-foreground hover:text-primary transition-colors rounded"
                      >
                        Dashboard
                      </Link>
                    )}
                    <LogOutButton />
                  </div>
                </>
              ) : (
                <Link
                  href="/authPage"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
