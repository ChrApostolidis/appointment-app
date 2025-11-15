import MainButton from "@/app/components/MainButton";
import { providers } from "../actions/actions";
import Link from "next/link";
import ImageRender from "./ImageRender";
import { Suspense } from "react";
import Loading from "./Loading";

export default async function ProfileCard({
  providers,
}: {
  providers: providers[];
}) {
  if (providers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-2xl">
        No providers found.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {providers.map((provider) => {
        return (
          <div
            key={provider.id}
            className="bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-colors"
          >
            <Link href={`/book/${provider.id}`} key={provider.id}>
              <div className="flex flex-col md:flex-row">
                <Suspense fallback={<Loading>Loading image...</Loading>}>
                  <ImageRender provider={provider} />
                </Suspense>

                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100 mb-1">
                        {provider.businessName}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {provider.serviceCategory}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Available
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {provider.description || "No description available."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>Thessaloniki</span>
                    <span> 9:00 AM - 6:00 PM</span>
                  </div>

                  <div className="mt-auto flex justify-end">
                    <MainButton
                      variant="secondary"
                      className="w-full md:w-auto"
                    >
                      Book Appointment
                    </MainButton>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
