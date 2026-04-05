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
            key={provider.userId}
            className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200"
          >
            <Link href={`/book/${provider.userId}`} key={provider.userId}>
              <div className="flex flex-col md:flex-row">
                <Suspense fallback={<Loading>Loading image...</Loading>}>
                  <ImageRender className="md:w-64 md:h-auto h-48" provider={provider} />
                </Suspense>

                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">
                        {provider.businessName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {provider.serviceCategory}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Available
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {provider.description || "No description available."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
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
