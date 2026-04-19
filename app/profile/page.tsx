"use server";
import {
  getCustomerDataById,
  getProviderClosedDates,
  getProviderWorkingHoursById,
} from "./actions/profileActions";
import { getCurrentUser } from "@/auth/currentUser";
import {
  FullProviderData,
  getFullProviderDataById,
} from "./actions/profileActions";
import ProviderProfile from "./components/ProviderProfile";
import { notFound } from "next/navigation";
import CustomerProfile from "./components/CustomerProfile";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) notFound();

  if (currentUser.role == "provider") {
    const [data, closedDates, provider] = await Promise.all([
      getProviderWorkingHoursById(currentUser.id),
      getProviderClosedDates(currentUser.id),
      getFullProviderDataById(currentUser.id),
    ]);
    if (!provider) notFound();
    return (
      <>
        <ProviderProfile
          currentUser={currentUser}
          provider={provider}
          data={data}
          closedDates={closedDates}
        />
      </>
    );
  } else {
    const customer = await getCustomerDataById(currentUser.id);
     if (!customer) notFound();
    return (
      <>
      <CustomerProfile customer={customer} currentUser={currentUser} />
      </>
    )
  }
}
