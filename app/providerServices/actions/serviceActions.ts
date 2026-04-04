"use server";

import { db } from "@/drizzle/db";
import { servicesTable, Service } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServiceFormValues } from "../schema";

export async function getProviderServices(
  providerId: string,
  onlyActive?: boolean
): Promise<Service[]> {
  try {
    const conditions = onlyActive
      ? and(
          eq(servicesTable.providerId, providerId),
          eq(servicesTable.isActive, true)
        )
      : eq(servicesTable.providerId, providerId);

    return await db.select().from(servicesTable).where(conditions);
  } catch (error) {
    console.error("Error fetching provider services:", error);
    return [];
  }
}

export async function createService(
  providerId: string,
  data: ServiceFormValues
): Promise<{ error?: string }> {
  try {
    await db.insert(servicesTable).values({
      providerId,
      name: data.name,
      description: data.description,
      price: data.price,
    });
    revalidatePath("/providerServices");
    return {};
  } catch (error) {
    console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

export async function updateService(
  id: string,
  data: ServiceFormValues
): Promise<{ error?: string }> {
  try {
    await db
      .update(servicesTable)
      .set({
        name: data.name,
        description: data.description,
        price: data.price,
      })
      .where(eq(servicesTable.id, id));
    revalidatePath("/providerServices");
    return {};
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Failed to update service" };
  }
}

export async function deleteService(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    revalidatePath("/providerServices");
    return {};
  } catch (error) {
    console.error("Error deleting service:", error);
    return { error: "Failed to delete service" };
  }
}

export async function toggleService(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  try {
    await db
      .update(servicesTable)
      .set({ isActive })
      .where(eq(servicesTable.id, id));
    revalidatePath("/providerServices");
    return {};
  } catch (error) {
    console.error("Error toggling service:", error);
    return { error: "Failed to toggle service" };
  }
}
