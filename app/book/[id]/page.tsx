import Header from "@/app/components/Header";
import { getProviderById, singleProvider } from "../actions/actions";
import { getCurrentUser } from "@/auth/currentUser";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser({ withFullUser: true });
  const provider: singleProvider | null = await getProviderById(id);

  if (!currentUser) {
    return "User not found";
  }

  return (
    <div>
      <Header user={currentUser} />
      <h1>{provider?.businessName}</h1>
      <p>{provider?.description}</p>
      <p>{provider?.serviceCategory}</p>
    </div>
  );
}
