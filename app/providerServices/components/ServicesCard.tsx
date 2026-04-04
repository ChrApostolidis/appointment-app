"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Service } from "@/drizzle/schema";
import { deleteService, toggleService } from "../actions/serviceActions";

type ServicesCardProps = {
  service: Service;
  onEdit: (service: Service) => void;
};

export default function ServicesCard({ service, onEdit }: ServicesCardProps) {
  const [enabled, setEnabled] = useState(service.isActive);
  const router = useRouter();

  const handleToggle = async () => {
    const next = !enabled;
    setEnabled(next);
    await toggleService(service.id, next);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteService(service.id);
    router.refresh();
  };

  return (
    <div className="flex justify-center items-center my-4">
      <div className="relative bg-background rounded-lg border border-muted shadow-md w-full max-w-4xl p-4">
        {!enabled && (
          <div className="absolute inset-0 rounded-lg transition-all duration-500 z-10 bg-background/60" />
        )}
        <div className="flex justify-between gap-3 mb-2">
          <div className="flex items-center justify-center gap-2">
            <Pencil
              size={18}
              className="cursor-pointer text-foreground hover:text-primary"
              onClick={() => onEdit(service)}
            />
            <Trash2
              size={18}
              className="cursor-pointer text-foreground hover:text-red-500"
              onClick={handleDelete}
            />
            {!enabled && <p className="text-sm text-foreground">Inactive</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              className={`z-11 w-12 h-6 rounded-full transition-colors duration-300 ${
                enabled ? "bg-primary" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              ></div>
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-1">{service.name}</h2>
        <div className="flex justify-between">
          <p className="text-gray-600">{service.description}</p>
          <div className="flex items-end gap-2">
            <p>${service.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
