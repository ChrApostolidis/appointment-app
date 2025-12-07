"use server";

import { db } from "@/drizzle/db";
import {
  appoinmentsTable,
  logoInfoTable,
  ProviderTable,
} from "@/drizzle/schema";
import { and, eq, gte, lt } from "drizzle-orm";
import {
  addDays,
  addMinutes,
  buildDayWindow,
  overlaps,
  startOfDay,
} from "../utils/helper";
import { getProviderWorkingHoursById } from "@/app/profile/actions/profileActions";

export interface providers {
  id: string;
  userId: string;
  businessName: string;
  serviceCategory: string;
  description: string | null;
  logoId: string | null;
  logoUrl: string | null;
}

// The getProviders joins the tables 'providers' and 'logo_info' to fetch provider details along with their logo URLs.
export async function getProviders(): Promise<providers[]> {
  try {
    const providers = await db
      .select({
        id: ProviderTable.id,
        userId: ProviderTable.userId,
        businessName: ProviderTable.businessName,
        serviceCategory: ProviderTable.serviceCategory,
        description: ProviderTable.description,
        logoId: ProviderTable.logoId,
        logoUrl: logoInfoTable.logoUrl,
      })
      .from(ProviderTable)
      .leftJoin(logoInfoTable, eq(ProviderTable.logoId, logoInfoTable.logoId));

    return providers;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
}

export interface singleProvider {
  businessName: string;
  serviceCategory: string;
  description: string | null;
  logoUrl: string | null;
}

export async function getProviderById(
  providerId: string
): Promise<singleProvider | null> {
  try {
    const provider = await db
      .select({
        businessName: ProviderTable.businessName,
        serviceCategory: ProviderTable.serviceCategory,
        description: ProviderTable.description,
        logoUrl: logoInfoTable.logoUrl,
      })

      .from(ProviderTable)

      .leftJoin(logoInfoTable, eq(ProviderTable.logoId, logoInfoTable.logoId))
      .where(eq(ProviderTable.userId, providerId))
      .limit(1);
    return provider[0];
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    return null;
  }
}

export type trueFalse = "true" | "false";

export type ProviderFilters = {
  serviceCategory?: string;
  gender?: string;
  availability?: trueFalse;
};

export async function getFilteredProviders(
  options: ProviderFilters,
  page: string | string[],
  per_page: string | string[]
): Promise<{
  filteredProviders: providers[];
  totalCount: number;
}> {
  let filteredProviders = await getProviders();
  let startIndex = 0;
  let endIndex = 0;

  if (options?.serviceCategory) {
    filteredProviders = filteredProviders.filter((provider) => {
      return provider.serviceCategory === options.serviceCategory;
    });
  }

  // Pagination
  // passing totalCount before slicing for pagination
  const totalCount = filteredProviders.length;
  if (page && per_page) {
    // Params might be an array checking first if the value is an array otherwise use the value directly
    const pageNum = Math.max(1, Number(Array.isArray(page) ? page[0] : page));
    const perPageNum = Math.max(
      1,
      Number(Array.isArray(per_page) ? per_page[0] : per_page)
    );
    startIndex = (pageNum - 1) * perPageNum;
    endIndex = Math.min(startIndex + perPageNum, totalCount);
    filteredProviders = filteredProviders.slice(startIndex, endIndex);
  }

  return { filteredProviders, totalCount };
}

export async function getNextAvailableSlot(
  providerId: string
): Promise<{ startAt: Date; endAt: Date } | undefined> {
  const workingHours = await getProviderWorkingHoursById(providerId);

  if (!workingHours) {
    throw new Error("No working hours available");
  }

  const now = new Date();
  const windowEnd = addDays(now, 30);

  const bookings = await db
    .select({
      startAt: appoinmentsTable.startAt,
      endAt: appoinmentsTable.endAt,
    })
    .from(appoinmentsTable)
    .where(
      and(
        eq(appoinmentsTable.providerId, providerId),
        gte(appoinmentsTable.startAt, now),
        lt(appoinmentsTable.startAt, windowEnd)
      )
    );

  let cursor = startOfDay(now);
  for (cursor < windowEnd; (cursor = addDays(cursor, 1)); ) {
    const weekdayKey = cursor
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase(); // return "monday", "tuesday", etc.
    const entry = workingHours[weekdayKey];
    if (!entry || !entry.enabled) {
      continue; // Provider is closed on this day
    }

    const { start, end } = buildDayWindow(cursor, entry); // returns timestaps
    const slotDuration = 60; // in minutes

    for (
      let slotStart = new Date(start);
      addMinutes(slotStart, slotDuration) <= end;
      slotStart = addMinutes(slotStart, slotDuration)
    ) {
      const slotEnd = addMinutes(slotStart, slotDuration);
      const hasConflict = bookings.some((b) => overlaps(slotStart, slotEnd, b));
      if (!hasConflict && slotEnd > now) {
        return { startAt: slotStart, endAt: slotEnd };
      }
    }
  }
  return undefined;
}
