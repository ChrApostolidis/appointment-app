"use client";

// import { toggleRole } from "../../actions/toggleRole";

export function ToggleRoleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="cursor-pointer bg-amber-300 border-2 border-amber-400 rounded-lg px-4 py-2 hover:border-amber-950"
      onClick={onClick}
    >
      Toggle Role
    </button>
  );
}
