// export const updateProviderSchema = z.object({
//   businessName: z.string().min(5, "Business Name is required"),
//   serviceCategory: z.string().min(2, "Service Category is required"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
// });

export const updateHoursSchema = z.object({
  userId: z.string().uuid(),
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:MM
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});

export const addHoursSchema = z.object({
  userId: z.string().uuid(),
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:MM
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
});