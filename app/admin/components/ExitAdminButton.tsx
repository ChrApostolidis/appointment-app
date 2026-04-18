"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toggleRole } from "@/app/actions/toggleRole";
import MainButton from "@/app/components/MainButton";

export default function ExitAdminButton() {
  const router = useRouter();

  const handleExit = async () => {
    await toggleRole();
    router.push("/private");
  };

  return (
    <MainButton variant="danger" onClick={handleExit}>
      <span className="flex items-center gap-2">
        <LogOut size={16} />
        Exit Admin
      </span>
    </MainButton>
  );
}
