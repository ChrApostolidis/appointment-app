type ProgressBarProps = {
  progress: number; // 0 → 100
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <>
      <span
        className="pointer-events-none absolute left-0 bottom-0 block h-px bg-primary p-0.5 transition-[width] duration-300 ease-out"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </>
  );
}
