"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";

import { getBookedAppointments } from "./actions/actions";
import MainSection from "./components/MainSection";

export default async function AppointmentsPage() {
  const user = await getCurrentUser({ withFullUser: true });

  if (!user) {
    throw new Error("User not Authorized");
  }

  const bookings = await getBookedAppointments(user.id);

  return (
    <div>
      <Header user={user} />
      <h1 className="text-2xl lg:text-3xl font-bold my-4 text-center">
        My Appointments
      </h1>
      <MainSection bookings={bookings} />
    </div>
  );
}
