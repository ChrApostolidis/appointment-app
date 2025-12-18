"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";

import { getBookedAppointments, getBookedAppointmentsForProvider } from "./actions/actions";
import MainSection from "./components/MainSection";

export default async function AppointmentsPage() {
  const user = await getCurrentUser({ withFullUser: true });

  if (!user) {
    throw new Error("User not Authorized");
  }

  const bookings =  user.role === "user" ? await getBookedAppointments(user.id) : await getBookedAppointmentsForProvider(user.id);

  return (
    <div>
      <Header user={user} />
      <h1 className="text-2xl lg:text-3xl font-bold my-4 text-center">
        My Appointments
      </h1>
      <MainSection user={user} bookings={bookings} />
    </div>
  );
}
