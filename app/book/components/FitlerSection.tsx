"use client";

import { useState } from "react";

export default function FilterSection({
  title,
  children,
  scrollable,
}: {
  title: string;
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center py-3 text-left text-gray-200 hover:text-foreground transition"
      >
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-xl text-foreground">{isOpen ? "−" : "+"}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`pl-4 pb-3 text-gray-400 text-md ${
            scrollable
              ? "max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground scrollbar-track-foreground"
              : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
