"use client";
import { useState } from "react";
import { logOut } from "../actions/actions";

export default function LogOutButton() {
  const [loggingOut, setLoggingOut] = useState(false);
  return (
    <button
      className="cursor-pointer w-full text-left px-2 py-1 text-sm text-red-500 hover:text-red-400 transition-colors rounded"
      onClick={async () => {
        setLoggingOut(true);
        await logOut();
        setLoggingOut(false);
      }}
      disabled={loggingOut}
    >
      {loggingOut ? "Logging Out..." : "Log Out"}
    </button>
  );
}
