"use client";
import { logOut } from "../actions";

export default function LogOutButton() {
  return (
    <button
      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
      onClick={async () => await logOut()}
    >
      Logout
    </button>
  );
}
