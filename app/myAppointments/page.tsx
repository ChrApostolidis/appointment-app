"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";


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
      </div>
    </div>
  );
}
