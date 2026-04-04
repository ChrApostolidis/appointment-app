"use client";

import { Service } from "@/drizzle/schema";
import ServicesCard from "./ServicesCard";

type ServicesListProps = {
  services: Service[];
  onEdit: (service: Service) => void;
};

export default function ServicesList({ services, onEdit }: ServicesListProps) {
  if (services.length === 0) {
    return (
      <div className="flex justify-center items-center mt-16 px-4">
        <p className="text-foreground/60 text-center text-lg">
          No services yet. Add your first service to let clients know what you
          offer.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {services.map((service) => (
        <ServicesCard key={service.id} service={service} onEdit={onEdit} />
      ))}
    </div>
  );
}
