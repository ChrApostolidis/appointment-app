"use client";
import { useState } from "react";
import { logOut } from "../actions/actions";

export default function LogOutButton() {
  const [loggingOut, setLoggingOut] = useState(false);
  return (
    <button
      className="cursor-pointer w-full text-left px-2 py-1 text-sm hover:bg-primary-hover text-red-500 rounded"
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
