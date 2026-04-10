"use server";

import { db } from "@/drizzle/db";
import { appoinmentsTable, servicesTable, UserTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { formatTime } from "@/app/book/utils/helper";

export type DashboardStats = {
  total: number;
  pending: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  revenue: number;
  recentAppointments: {
    appointmentId: string;
    customerName: string;
    startAt: string;
    date: string;
    status: string;
    serviceName: string | null;
  }[];
  activeServices: number;
  totalServices: number;
};

export async function getDashboardStats(
  providerId: string
): Promise<DashboardStats> {
  const [allAppointments, recentRaw, services] = await Promise.all([
    db
      .select({
        status: appoinmentsTable.status,
        price: servicesTable.price,
      })
      .from(appoinmentsTable)
      .leftJoin(servicesTable, eq(appoinmentsTable.serviceId, servicesTable.id))
      .where(eq(appoinmentsTable.providerId, providerId)),

    db
      .select({
        appointmentId: appoinmentsTable.id,
        customerName: UserTable.name,
        startAt: appoinmentsTable.startAt,
        status: appoinmentsTable.status,
        serviceName: appoinmentsTable.serviceName,
      })
      .from(appoinmentsTable)
      .innerJoin(UserTable, eq(appoinmentsTable.customerId, UserTable.id))
      .where(eq(appoinmentsTable.providerId, providerId))
      .orderBy(desc(appoinmentsTable.createdAt))
      .limit(5),

    db
      .select({ isActive: servicesTable.isActive })
      .from(servicesTable)
      .where(eq(servicesTable.providerId, providerId)),
  ]);

  const total = allAppointments.length;
  const pending = allAppointments.filter((a) => a.status === "Pending").length;
  const upcoming = allAppointments.filter((a) => a.status === "Upcoming").length;
  const completed = allAppointments.filter((a) => a.status === "Completed").length;
  const cancelled = allAppointments.filter((a) => a.status === "Cancelled").length;
  const revenue = allAppointments
    .filter((a) => a.status === "Completed" && a.price != null)
    .reduce((sum, a) => sum + (a.price ?? 0), 0);

  const recentAppointments = recentRaw.map((a) => ({
    appointmentId: a.appointmentId,
    customerName: a.customerName,
    startAt: formatTime(a.startAt),
    date: new Date(a.startAt).toLocaleDateString(),
    status: a.status,
    serviceName: a.serviceName,
  }));

  return {
    total,
    pending,
    upcoming,
    completed,
    cancelled,
    revenue,
    recentAppointments,
    activeServices: services.filter((s) => s.isActive).length,
    totalServices: services.length,
  };
}
