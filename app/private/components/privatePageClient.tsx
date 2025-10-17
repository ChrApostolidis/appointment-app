"use client";

import { useState } from "react";
import { ToggleRoleButton } from "./ToggleRoleButton";
import PasswordModal from "./passwordModal";
import PinInput from "./PinInput";
import { passwordCheck } from "@/app/actions/passwordCheck";
import { redirect } from "next/navigation";
import { toggleRole } from "@/app/actions/toggleRole";

export default function PrivatePageClient() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <ToggleRoleButton onClick={() => setIsOpen(!isOpen)} />

      <PasswordModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-semibold mb-2 text-center">Admin Pass</h2>
        <p>Put the 6-digit passcode to access this section.</p>
        <PinInput length={6} onComplete={async (pin) => {
          const isValid = await passwordCheck(pin);
          if (isValid) {
            await toggleRole();
            redirect("/admin");
          } else {
            return null
          }
        }} />
      </PasswordModal>
    </div>
  );
}
