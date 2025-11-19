"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

type PaginationControlsProps = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
};

export default function PaginationControls({
  hasNextPage,
  hasPrevPage,
  total,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "4");

  const buildUrl = (nextPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(Math.max(1, nextPage)));
    params.set("per_page", String(per_page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const totalPages = Math.max(1, Math.ceil(total / per_page));

  return (
    <div className="flex justify-center items-center gap-10 mt-8">
      <button
        className="cursor-pointer"
        disabled={!hasPrevPage}
        onClick={() => router.push(buildUrl(page - 1), { scroll: false })}
      >
        Previous
      </button>
      <div>{`Page ${page} / ${totalPages}`}</div>
      <button
        disabled={!hasNextPage}
        className="cursor-pointer"
        onClick={() => router.push(buildUrl(page + 1), { scroll: false })}
      >
        Next
      </button>
    </div>
  );
}
