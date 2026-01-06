"use client";

import ProgressBar from "./ProgressBar";

type StepperButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  progress: number;
};

export default function StepperButton({
  onClick,
  icon,
  title,
  isActive,
  progress,
}: StepperButtonProps) {
  return (
    <div className="relative w-full text-foreground py-6 border-b border-gray-600">
      <button
        onClick={onClick}
        className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-primary" : "text-foreground"}`}
      >
        {icon}
        <h3 className="text-2xl">{title}</h3>
      </button>
      {isActive && (
        <ProgressBar progress={progress} />
      )}
    </div>
  );
}
