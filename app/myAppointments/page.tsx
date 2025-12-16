"use server";

import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";
import BookingFilter from "./components/BookingFilter";
import AppointmentCard from "./components/AppointmentCard";
import { getBookedAppointments } from "./actions/actions";

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
      <div className="flex flex-col justify-center items-center">
        <BookingFilter />
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.appointmentId} className="w-full flex justify-center">
              <AppointmentCard bookings={[booking]} />
            </div>
          ))
        ) : (
          <p className="text-foreground mt-4 text-2xl">
            No appointments found.
          </p>
        )}
      </div>
    </div>
  );
}
