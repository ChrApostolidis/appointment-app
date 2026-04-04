import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";
import { getProviderServices } from "./actions/serviceActions";
import ServicesPageClient from "./components/ServicesPageClient";

export default async function ProviderServicesPage() {
  const user = await getCurrentUser({ withFullUser: true });
  if (!user) return null;

  const services = await getProviderServices(user.id, false);

  return (
    <div>
      <Header user={user} />
      <ServicesPageClient services={services} providerId={user.id} />
    </div>
  );
}
