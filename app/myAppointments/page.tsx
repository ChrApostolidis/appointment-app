"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";
import BookingFilter from "./components/BookingFilter";


export default async function AppointmentsPage() {
  const user = await getCurrentUser({ withFullUser: true });

  if (!user) {
    throw new Error("User not Authorized");
  }

  return (
    <div>
      <Header user={user} />
      <h1 className="text-2xl lg:text-3xl font-bold my-4 text-center">
        My Appointments
      </h1>
      <div className="flex flex-col justify-center items-center">
        <BookingFilter />
        <div className="bg-foreground max-w-lg p-4 rounded-xl"></div>
      </div>
    </div>
  );
}
