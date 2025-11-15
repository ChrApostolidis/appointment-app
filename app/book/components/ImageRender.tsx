"use client";

import Image from "next/image";
import { providers } from "../actions/actions";

export default function ImageRender({ provider }: { provider: providers }) {
  const initials = provider.businessName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="md:w-64 h-48 md:h-auto relative bg-slate-800/50 shrink-0">
      {provider.logoUrl ? (
        <Image
          src={provider.logoUrl}
          alt={`${provider.businessName} logo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-slate-600">{initials}</span>
        </div>
      )}
    </div>
  );
}
