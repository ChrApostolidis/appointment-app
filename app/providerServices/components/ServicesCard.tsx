"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ServicesCard() {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex justify-center items-center my-4">
      <div className="relative bg-background rounded-lg border border-muted shadow-md w-full max-w-4xl p-4">
        {!enabled && (
          <div className="absolute inset-0 rounded-lg transition-all duration-500 z-10 bg-background/60" />
        )}
        <div className="flex justify-between gap-3 mb-2">
          <div className="flex items-center justify-center gap-2">
            <Pencil
              size={18}
              className="cursor-pointer text-foreground hover:text-primary"
            />
            <Trash2
              size={18}
              className="cursor-pointer text-foreground hover:text-red-500"
            />
            {!enabled && <p className="text-sm text-foreground">Inactive</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnabled((prev) => !prev)}
              className={`z-11 w-12 h-6 rounded-full transition-colors duration-300 ${
                enabled ? "bg-primary" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              ></div>
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-1">Service Name</h2>
        <div className="flex justify-between">
          <p className="text-gray-600">
            This is a service description placeholder.
          </p>
          <div className="flex items-end gap-2">
            <p>1hr</p>
            <p>$30</p>
          </div>
        </div>
      </div>
    </div>
  );
}
