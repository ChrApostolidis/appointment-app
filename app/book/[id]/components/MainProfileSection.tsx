"use server";

import { singleProvider } from "../../actions/actions";
import { FaLocationDot } from "react-icons/fa6";
import RatingStars from "../../components/RatingStars";
import ImageRender from "../../components/ImageRender";
import ButtonSection from "./ButtonSection";
import { WorkingHours } from "@/app/profile/data/hoursData";

type MainProfileSectionProps = {
  provider: singleProvider;
  nextAvailableSlot: { startAt: Date; endAt: Date } | undefined;
  workingHours: WorkingHours;
  providerId: string;
};

export default async function MainProfileSection({
  provider,
  nextAvailableSlot,
  providerId,
  workingHours,
}: MainProfileSectionProps) {

  

  const formattedNextSlot = nextAvailableSlot
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(nextAvailableSlot.startAt)
    : null;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700/50 bg-background shadow-xl backdrop-blur-sm">
      <div className="flex flex-col">
        <div className="relative w-full h-96 bg-slate-800/50 shrink-0">
          <ImageRender className="h-full w-full" provider={provider} />
        </div>

        <div className="flex-1 p-6 md:p-8 flex flex-col">
          <div className="flex-1">
            <div className="flex justify-between">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                {provider.businessName}
              </h1>
              <p className="text-2xl text-foreground mb-6">
                {provider.serviceCategory}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <RatingStars value={4} />
              <span className="text-md font-medium text-foreground mt-0.5">
                4.0
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/50">
                <FaLocationDot className="text-primary" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Location</p>
                <p className="text-xs text-foreground">Thessaloniki, Greece</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded-lg bg-background border border-slate-700/50">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-500/10">
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Next Available
                </p>
                <p className="text-xs text-green-400">
                  {formattedNextSlot ?? "No available slots"}
                </p>
              </div>
            </div>
          </div>
          <ButtonSection providerId={providerId} workingHours={workingHours} />
        </div>
      </div>
    </div>
  );
}
