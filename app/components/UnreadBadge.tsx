export default function UnreadBadge({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold leading-none text-white ${className}`}
    >
      <span aria-hidden="true">{count > 9 ? "9+" : count}</span>
      <span className="sr-only">
        {`${count} unread ${count === 1 ? "message" : "messages"}`}
      </span>
    </span>
  );
}
