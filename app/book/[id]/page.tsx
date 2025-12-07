"use server";

import Header from "@/app/components/Header";
import {
  getNextAvailableSlot,
  getProviderById,
  singleProvider,
} from "../actions/actions";
import { getCurrentUser } from "@/auth/currentUser";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import MainProfileSection from "./components/MainProfileSection";
import ServiceSection from "./components/ServicesSection";
import ProviderNotFound from "./components/ProviderNotFound";

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

  const nextAvailableSlot = await getNextAvailableSlot(id);


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
            <MainProfileSection provider={provider} nextAvailableSlot={nextAvailableSlot} />
            <ServiceSection provider={provider} />
          </>
        ) : (
         <ProviderNotFound />
        )}
      </div>
    </div>
  );
}
