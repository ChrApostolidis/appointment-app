import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";
import { redirect } from "next/navigation";
import { getDashboardStats } from "./actions/dashboardActions";
import {
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  Pending: "text-yellow-400",
  Upcoming: "text-blue-400",
  Completed: "text-green-400",
  Cancelled: "text-red-400",
};

export default async function DashboardPage() {
  const user = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  });

  if (user.role !== "provider") {
    redirect("/");
  }

  const stats = await getDashboardStats(user.id);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Revenue",
      value: `$${(stats.revenue / 100).toFixed(0)}`,
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Overview
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-1">
            Provider Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.name}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border bg-background p-5 flex flex-col gap-3 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}
                >
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2 rounded-2xl border bg-background p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recent Appointments
              </h2>
              <Link
                href="/myAppointments"
                className="text-sm text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {stats.recentAppointments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No appointments yet.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {stats.recentAppointments.map((appt) => (
                  <div
                    key={appt.appointmentId}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {appt.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appt.serviceName ?? "—"} · {appt.date} at{" "}
                        {appt.startAt}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${statusColor[appt.status] ?? "text-foreground"}`}
                    >
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Services overview */}
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Services
                </h2>
                <Link
                  href="/providerServices"
                  className="text-sm text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
                >
                  Manage <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {stats.activeServices}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      / {stats.totalServices} active
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Services visible to customers
                  </p>
                </div>
              </div>
            </div>

            {/* Booking breakdown */}
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Breakdown
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "Completed",
                    value: stats.completed,
                    color: "bg-green-400",
                    bar: "bg-green-400",
                  },
                  {
                    label: "Upcoming",
                    value: stats.upcoming,
                    color: "bg-blue-400",
                    bar: "bg-blue-400",
                  },
                  {
                    label: "Pending",
                    value: stats.pending,
                    color: "bg-yellow-400",
                    bar: "bg-yellow-400",
                  },
                  {
                    label: "Cancelled",
                    value: stats.cancelled,
                    color: "bg-red-400",
                    bar: "bg-red-400",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${item.color}`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.bar} rounded-full`}
                        style={{
                          width:
                            stats.total > 0
                              ? `${(item.value / stats.total) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
