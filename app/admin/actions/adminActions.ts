"use server";

import { db } from "@/drizzle/db";
import {
  appoinmentsTable,
  ProviderTable,
  servicesTable,
  UserTable,
} from "@/drizzle/schema";
import { count, desc, eq, gte, sum } from "drizzle-orm";

export type AdminStats = {
  totalUsers: number;
  totalProviders: number;
  appointmentsThisMonth: number;
  revenue: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const [
    usersResult,
    providersResult,
    appointmentsThisMonthResult,
    revenueResult,
  ] = await Promise.all([
    db.select({ value: count() }).from(UserTable),
    db.select({ value: count() }).from(ProviderTable),
    db
      .select({ value: count() })
      .from(appoinmentsTable)
      .where(gte(appoinmentsTable.startAt, firstOfMonth)),
    db
      .select({ value: sum(servicesTable.price) })
      .from(appoinmentsTable)
      .innerJoin(
        servicesTable,
        eq(appoinmentsTable.serviceId, servicesTable.id),
      )
      .where(eq(appoinmentsTable.status, "Completed")),
  ]);

  return {
    totalUsers: usersResult[0]?.value ?? 0,
    totalProviders: providersResult[0]?.value ?? 0,
    appointmentsThisMonth: appointmentsThisMonthResult[0]?.value ?? 0,
    revenue: Number(revenueResult[0]?.value ?? 0),
  };
}

export type RecentAppointment = {
  id: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  serviceName: string | null;
  startAt: Date;
  endAt: Date;
  status: string;
};

export async function getRecentAppointments(
  limit = 10,
): Promise<RecentAppointment[]> {
  return db
    .select({
      id: appoinmentsTable.id,
      customerName: UserTable.name,
      customerEmail: UserTable.email,
      businessName: ProviderTable.businessName,
      serviceName: appoinmentsTable.serviceName,
      startAt: appoinmentsTable.startAt,
      endAt: appoinmentsTable.endAt,
      status: appoinmentsTable.status,
    })
    .from(appoinmentsTable)
    .innerJoin(UserTable, eq(appoinmentsTable.customerId, UserTable.id))
    .innerJoin(
      ProviderTable,
      eq(appoinmentsTable.providerId, ProviderTable.userId),
    )
    .orderBy(desc(appoinmentsTable.createdAt))
    .limit(limit);
}
