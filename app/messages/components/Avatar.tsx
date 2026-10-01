"use client";

import { useState } from "react";

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-base",
  md: "w-12 h-12 text-lg",
} as const;

export default function Avatar({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl: string | null;
  size?: keyof typeof SIZE_CLASSES;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = logoUrl && failedUrl !== logoUrl;

  return (
    <div
      className={`${SIZE_CLASSES[size]} shrink-0 rounded-full overflow-hidden bg-secondary text-black border border-border flex items-center justify-center font-medium`}
      aria-hidden="true"
    >
      {showImage ? (
        // Plain <img>: logos may come from hosts not whitelisted in next.config
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setFailedUrl(logoUrl)}
        />
      ) : (
        <span>{name.trim().charAt(0).toUpperCase() || "?"}</span>
      )}
    </div>
  );
}
