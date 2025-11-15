"use server";

import Header from "@/app/components/Header";
import { getProviderById, singleProvider } from "../actions/actions";
import { getCurrentUser } from "@/auth/currentUser";
import ImageRender from "../components/ImageRender";
import RatingStars from "../components/RatingStars";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";
import MainButton from "@/app/components/MainButton";
import Link from "next/link";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser({ withFullUser: true });
  const provider: singleProvider | null = await getProviderById(id);

  if (!currentUser) {
    return "User not found";
  }

  if (!provider?.logoUrl) {
    return "Provider not found";
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={currentUser} />
      <div className="flex items-center gap-2 text-foreground hover:text-primary text-2xl mt-2 ml-4 lg:text-3xl">
        <Link href="/book">
          <FaArrowLeft />
        </Link>
      </div>

      <div className="flex justify-center items-center mt-3">
        <h3 className="text-2xl lg:text-3xl">Provider Profile</h3>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {provider ? (
          <>
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
                        <p className="text-sm font-medium text-foreground">
                          Location
                        </p>
                        <p className="text-xs text-foreground">
                          Thessaloniki, Greece
                        </p>
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
                          10:00 AM - June 10, 2025
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 pt-6 border-t border-slate-700/50">
                    <MainButton
                      variant="primary"
                      className="w-full md:w-auto md:px-8"
                    >
                      Book Appointment
                    </MainButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-700/50 bg-background shadow-xl backdrop-blur-sm p-6 md:p-8">
              <div className="mb-4">
                <div className="h-1 w-12 bg-primary rounded-full mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground`">
                  About Our Services
                </h2>
              </div>
              <p className="text-base leading-relaxed text-foreground mb-8">
                {provider.description}
              </p>
              <MainButton variant="secondary" className="w-full sm:w-auto">
                Contact Provider
              </MainButton>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">
                Provider Not Found
              </p>
              <p className="text-sm text-foreground mt-2">
                The provider you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
