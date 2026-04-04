"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/app/profile/components/Modal";
import MainButton from "@/app/components/MainButton";
import { Service } from "@/drizzle/schema";
import { ServiceFormSchema, ServiceFormValues } from "../schema";
import { createService, updateService } from "../actions/serviceActions";

type AddServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  editingService: Service | null;
};

export default function AddServiceModal({
  isOpen,
  onClose,
  providerId,
  editingService,
}: AddServiceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceFormSchema),
    defaultValues: { name: "", description: "", price: 0 },
  });

  useEffect(() => {
    if (editingService) {
      reset({
        name: editingService.name,
        description: editingService.description ?? "",
        price: editingService.price,
      });
    } else {
      reset({ name: "", description: "", price: 0 });
    }
  }, [editingService, reset]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (editingService) {
      await updateService(editingService.id, data);
    } else {
      await createService(providerId, data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-foreground mb-4">
        {editingService ? "Edit Service" : "Add Service"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="e.g. Haircut, Consultation"
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Briefly describe this service"
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("price")}
            type="number"
            min={1}
            placeholder="e.g. 30"
            className="bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>

        <div className="flex justify-center pt-2 border-t border-primary">
          <MainButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Service"}
          </MainButton>
        </div>
      </form>
    </Modal>
  );
}
