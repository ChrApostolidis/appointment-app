"use client";

import { redirect } from "next/navigation";
import { toggleRole } from "../actions/toggleRole";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl text-center">Admin Page - Access Restricted</h1>
      <div className="flex justify-center items-center">
        <button
          onClick={async () => {
            await toggleRole();
            redirect("/private");
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
