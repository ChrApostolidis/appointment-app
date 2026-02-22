"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";
import { PlusIcon } from "lucide-react";
import MainButton from "../components/MainButton";
import ServicesCard from "./components/ServicesCard";

export default async function ProviderServicesPage() {
  const user = await getCurrentUser({ withFullUser: true });
  return (
    <div>
      <Header user={user} />
      <div className="lg:relative flex flex-col items-center justify-center mt-5 px-4">
        <div className="text-center text-foreground">
          <h1 className="text-4xl font-bold mb-2">Your Services</h1>
          <p className="text-lg">From here you can manage your services.</p>
        </div>
        <div className="mt-2 lg:absolute lg:right-4 lg:mt-0">
          <MainButton className="flex rounded items-center justify-center">
            <PlusIcon className="mr-2" />
            Add Services
          </MainButton>
        </div>
      </div>
      <ServicesCard />
    </div>
  );
}
