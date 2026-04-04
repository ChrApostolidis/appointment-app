import { z } from "zod";

export const ServiceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().int().positive("Price must be a positive whole number"),
});

export type ServiceFormValues = z.infer<typeof ServiceFormSchema>;
