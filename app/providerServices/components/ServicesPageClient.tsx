"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import MainButton from "@/app/components/MainButton";
import { Service } from "@/drizzle/schema";
import ServicesList from "./ServicesList";
import AddServiceModal from "./AddServiceModal";

type ServicesPageClientProps = {
  services: Service[];
  providerId: string;
};

export default function ServicesPageClient({
  services,
  providerId,
}: ServicesPageClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  return (
    <div className="px-4">
      <div className="lg:relative flex flex-col items-center justify-center mt-5">
        <div className="text-center text-foreground">
          <h1 className="text-4xl font-bold mb-2">Your Services</h1>
          <p className="text-lg">From here you can manage your services.</p>
        </div>
        <div className="mt-2 lg:absolute lg:right-4 lg:mt-0">
          <MainButton
            className="flex rounded items-center justify-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="mr-2" />
            Add Services
          </MainButton>
        </div>
      </div>

      <ServicesList
        services={services}
        onEdit={(service) => setEditingService(service)}
      />

      <AddServiceModal
        isOpen={isAddModalOpen || editingService !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        providerId={providerId}
        editingService={editingService}
      />
    </div>
  );
}
