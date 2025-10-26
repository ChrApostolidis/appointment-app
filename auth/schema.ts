import { z } from "zod"

export const signInSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z.object({
  name: z.string().min(5, "Name is required"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "provider"]),
})

export const completeSignUpProviderSchema = z.object({
  userId: z.string().optional(),
  businessName: z.string().min(5, "Business Name is required"),
  serviceCategory: z.string().min(2, "Service Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

export const completeSignUpCustomerSchema = z.object({
  userId: z.string().optional(),
  interests: z.string().min(2, "Interests are required"),
})