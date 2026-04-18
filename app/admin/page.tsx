import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth/currentUser";
import {
  getAdminStats,
  getRecentAppointments,
} from "./actions/adminActions";
import StatsCards from "./components/StatsCards";
import RecentAppointments from "./components/RecentAppointments";
import ExitAdminButton from "./components/ExitAdminButton";

export default async function AdminPage() {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (currentUser.role !== "admin") {
    redirect("/private");
  }

  const [stats, recentAppointments] = await Promise.all([
    getAdminStats(),
    getRecentAppointments(10),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of platform activity and recent bookings
          </p>
        </div>
        <ExitAdminButton />
      </div>

      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      <RecentAppointments appointments={recentAppointments} />
    </div>
  );
}
