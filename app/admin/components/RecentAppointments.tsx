import { RecentAppointment } from "../actions/adminActions";

type BookingStatus = "Pending" | "Upcoming" | "Completed" | "Cancelled";

const statusPillMap: Record<BookingStatus, string> = {
  Pending: "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400",
  Upcoming: "bg-orange-400/15 text-orange-600 dark:text-orange-400",
  Completed: "bg-green-400/15 text-green-600 dark:text-green-400",
  Cancelled: "bg-red-400/15 text-red-500 dark:text-red-400",
};

type RecentAppointmentsProps = {
  appointments: RecentAppointment[];
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function RecentAppointments({
  appointments,
}: RecentAppointmentsProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-foreground text-lg font-semibold">
          Recent Appointments
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Latest bookings across all providers
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No appointments yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-second-background">
                <tr className="text-left text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Provider</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const status = appt.status as BookingStatus;
                  return (
                    <tr
                      key={appt.id}
                      className="border-t border-border hover:bg-second-background/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="text-foreground font-medium">
                          {appt.customerName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {appt.customerEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-foreground">
                        {appt.businessName}
                      </td>
                      <td className="px-5 py-3 text-foreground">
                        {appt.serviceName ?? "Basic Appointment"}
                      </td>
                      <td className="px-5 py-3 text-foreground">
                        {formatDate(appt.startAt)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {formatTime(appt.startAt)} – {formatTime(appt.endAt)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                            statusPillMap[status] ??
                            "bg-gray-400/15 text-gray-600"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-border">
            {appointments.map((appt) => {
              const status = appt.status as BookingStatus;
              return (
                <div key={appt.id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-foreground font-medium truncate">
                        {appt.customerName}
                      </p>
                      <p className="text-muted-foreground text-xs truncate">
                        {appt.businessName}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusPillMap[status] ?? "bg-gray-400/15 text-gray-600"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{appt.serviceName ?? "Basic Appointment"}</span>
                    <span>
                      {formatDate(appt.startAt)} · {formatTime(appt.startAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
