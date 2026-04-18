import { CalendarCheck, DollarSign, Store, Users } from "lucide-react";
import { AdminStats } from "../actions/adminActions";

type StatsCardsProps = {
  stats: AdminStats;
};

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      accent: "bg-blue-400/15 text-blue-500 dark:text-blue-400",
    },
    {
      label: "Total Providers",
      value: stats.totalProviders.toLocaleString(),
      icon: Store,
      accent: "bg-purple-400/15 text-purple-500 dark:text-purple-400",
    },
    {
      label: "Appointments This Month",
      value: stats.appointmentsThisMonth.toLocaleString(),
      icon: CalendarCheck,
      accent: "bg-orange-400/15 text-orange-500 dark:text-orange-400",
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      accent: "bg-green-400/15 text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs uppercase tracking-wide font-medium">
                  {card.label}
                </p>
                <p className="text-foreground text-2xl lg:text-3xl font-bold mt-2">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${card.accent}`}
              >
                <Icon size={18} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
