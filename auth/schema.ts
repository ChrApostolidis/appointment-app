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