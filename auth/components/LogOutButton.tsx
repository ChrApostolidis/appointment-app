"use client";
import { logOut } from "../actions";

export default function LogOutButton() {
  return (
    <button
      className="cursor-pointer w-full text-left px-2 py-1 text-sm hover:bg-[var(--primary-hover)] rounded"
      onClick={async () => await logOut()}
    >
      Logout
    </button>
  );
}
