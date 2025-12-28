"use server";
import { getCustomerDataById, getProviderWorkingHoursById } from "./actions/profileActions";
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
    const data = await getProviderWorkingHoursById(currentUser.id);
    const provider: FullProviderData | null = await getFullProviderDataById(
      currentUser.id
    );
    if (!provider) notFound();
    return (
      <>
        <ProviderProfile
          currentUser={currentUser}
          provider={provider}
          data={data}
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
