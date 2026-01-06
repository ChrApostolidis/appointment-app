"use client";

type StepperButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
};

export default function StepperButton({
  onClick,
  icon,
  title,
}: StepperButtonProps) {
  return (
    <div className="text-foreground py-6 border-border border-b pr-40">
      <button
        onClick={onClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        {icon}
        <h3 className="text-2xl">{title}</h3>
      </button>
    </div>
  );
}
