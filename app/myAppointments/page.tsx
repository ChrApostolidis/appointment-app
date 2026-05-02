"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";

import {
  AppointmentStatusTab,
  getBookedAppointments,
  getBookedAppointmentsForProvider,
} from "./actions/actions";
import MainSection from "./components/MainSection";

const VALID_TABS: readonly AppointmentStatusTab[] = [
  "All",
  "Pending",
  "Upcoming",
  "Completed",
  "Cancelled",
] as const;

const DEFAULT_PAGE_SIZE = 5;

function pickFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser({ withFullUser: true });

  if (!user) {
    throw new Error("User not Authorized");
  }

  const sp = await searchParams;
  const rawTab = pickFirst(sp.tab);
  const tab: AppointmentStatusTab = VALID_TABS.includes(
    rawTab as AppointmentStatusTab
  )
    ? (rawTab as AppointmentStatusTab)
    : "Upcoming";

  const page = Math.max(1, Number(pickFirst(sp.page)) || 1);
  const pageSize = Math.max(
    1,
    Number(pickFirst(sp.pageSize)) || DEFAULT_PAGE_SIZE
  );

  const { appointments, totalCount, statusCounts } =
    user.role === "user"
      ? await getBookedAppointments(user.id, { status: tab, page, pageSize })
      : await getBookedAppointmentsForProvider(user.id, {
          status: tab,
          page,
          pageSize,
        });

  return (
    <div>
      <Header user={user} />
      <h1 className="text-2xl lg:text-3xl font-bold my-4 text-center">
        My Appointments
      </h1>
      <MainSection
        user={user}
        bookings={appointments}
        currentTab={tab}
        currentPage={page}
        pageSize={pageSize}
        totalCount={totalCount}
        statusCounts={statusCounts}
      />
    </div>
  );
}
