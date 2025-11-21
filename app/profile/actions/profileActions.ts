import { db } from "@/drizzle/db";
import { logoInfoTable, ProviderTable, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export type FullProviderData = {
  businessName: string;
  serviceCategory: string;
  description: string | null;
  email: string;
  logoUrl: string | null;
  createdAt: Date;
};

export async function getFullProviderDataById(providerId: string): Promise<FullProviderData | null> {
  try {
    const provider = await db
      .select({
        businessName: ProviderTable.businessName,
        serviceCategory: ProviderTable.serviceCategory,
        description: ProviderTable.description,
        email: UserTable.email,
        logoUrl: logoInfoTable.logoUrl,
        createdAt: ProviderTable.createdAt,
      })
      .from(ProviderTable)
      // Join the related user via providers.userId -> users.id
      .innerJoin(UserTable, eq(ProviderTable.userId, UserTable.id))
      // Join the optional logo info via providers.logoId -> logo_info.logoId
      .leftJoin(logoInfoTable, eq(ProviderTable.logoId, logoInfoTable.logoId))
      // Filter by the current user id mapped from providers.userId
      .where(eq(ProviderTable.userId, providerId))
      .limit(1);
    return provider[0];
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    return null;
  }
}


