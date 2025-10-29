"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface NavMenuItem {
  name: string;
  link: string;
}

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const NavMenuItems: NavMenuItem[] = [
    { name: "My Appointments", link: "#events"},
    { name: "Book", link: "#books" },
    { name: "Calendar", link: "#calendar"},
  ];

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
          isSticky ? "bg-[#000000] shadow-lg" : "bg-[#060606]"
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
              <p className="text-white text-xl lg:text-2xl">AppointMe</p>
            </div>
          </div>
          <div className="hidden lg:flex gap-10 items-center">
            <nav className="">
              <ul className="flex space-x-8">
                {NavMenuItems.map(({ name, link }) => (
                  <li key={name}>
                    <a
                      href={link}
                      className="text-white hover:text-secondary-foreground lg:text-xl"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="hidden lg:flex">
            <div className="border-1 w-12 h-12 rounded-full mr-1" />
          </div>
          {/* Burger Button */}
          <div className="relative bg-[#2f7899] rounded-2xl hover:cursor-pointer flex items-center justify-center p-1 m-2 lg:hidden">
            <button
              onClick={() => setMenuOpen(() => !menuOpen)}
              className="w-10 h-10 flex items-center justify-center relative lg:hidden"
            >
              <span className="relative w-6 h-6">
                <motion.span
                  style={{ transformOrigin: "center" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block h-0.5 w-6 bg-white rounded"
                  animate={
                    menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }
                  }
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  style={{ transformOrigin: "center" }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block h-0.5 w-6 bg-white rounded"
                  animate={
                    menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }
                  }
                  transition={{ duration: 0.2 }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
