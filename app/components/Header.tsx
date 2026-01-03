"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { userType } from "../registerForms/components/LockedRegisterForm";
import Profile from "./Profile";
import NavMenu from "./NavMenu";
import BurgerButton from "./BurgerButton";
import Link from "next/link";

export default function Header({ user }: { user: userType | null }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent layout shift when header is fixed */}
      <div className="h-20"></div>
      <header
        className={`h-20 fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isSticky ? "bg-second-background shadow-lg" : "bg-second-background"
        }`}
      >
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center ">
            <Link href="/" className="ml-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/app-logo.png"
                  alt="App Logo"
                  width={64}
                  height={64}
                />
                <p className="text-xl lg:text-2xl">
                  Appoint<span className="text-primary">Me</span>
                </p>
              </div>
            </Link>
          </div>
          <NavMenu user={user} />

          <div className="hidden lg:flex">
            {user ? (
              <>
                <Profile user={user} />
              </>
            ) : (
              <div>
                <Link
                  href="/authPage"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Login / Register
                </Link>
              </div>
            )}
          </div>
          <BurgerButton />
        </div>
      </header>
    </>
  );
}
