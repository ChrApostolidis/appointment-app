"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { userType } from "../registerForms/components/LockedRegisterForm";
import Profile from "./Profile";
import ToggleTheme from "./ToggleTheme";
import NavMenu from "./NavMenu";
import BurgerButton from "./BurgerButton";

export default function Header({ user }: { user: userType }) {
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
          isSticky ? "bg-background shadow-lg" : "bg-background"
        }`}
      >
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center ">
            <div className="flex items-center justify-center">
              <Image
                src="/app-logo.png"
                alt="App Logo"
                width={64}
                height={64}
              />
              <p className="text-primary text-xl lg:text-2xl">AppointMe</p>
            </div>
          </div>
          <NavMenu />

          <div className="hidden lg:flex">
            {user ? (
              <>
                <ToggleTheme />
                <Profile user={user} />
              </>
            ) : (
              <div>
                <button className="mr-0.5 cursor-pointer bg-secondary-foreground text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:bg-[#256078] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm">
                  Login/Register
                </button>
              </div>
            )}
          </div>
          <BurgerButton />
        </div>
      </header>
    </>
  );
}
