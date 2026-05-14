"use client";
import MainButton from "@/app/components/MainButton";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  size?: "md" | "lg";
  children: React.ReactNode;
};

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  md: "max-w-md lg:max-w-xl",
  lg: "max-w-md md:max-w-2xl lg:max-w-4xl",
};

export default function Modal({ isOpen, onClose, size = "md", children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 "
      onClick={onClose}
    >
      <div
        className={`bg-background text-white p-6 rounded-xl shadow-xl w-[90%] ${sizeClasses[size]} max-h-[90vh] overflow-y-auto lg:space-y-4`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          <MainButton type="button" variant="danger" onClick={onClose}>
            <X />
          </MainButton>
        </div>
        {children}
      </div>
    </div>
  );
}
