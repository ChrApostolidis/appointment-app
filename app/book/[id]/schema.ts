import { z } from "zod";

export const BookingSchema = z.object({
  providerId: z.string().min(1, "Provider is required"),
  customerId: z.string().min(1, "Customer is required"),
  startAt: z.string().min(1, "Start time is required"),
  endAt: z.string().min(1, "End time is required"),
  businessName: z.string().min(1, "Business name is required"),
  serviceCategory: z.string().min(1, "Service category is required"),
});
