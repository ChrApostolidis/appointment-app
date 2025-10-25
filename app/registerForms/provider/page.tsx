import { getCurrentUser } from "@/auth/currentUser";
import RegisterProviderClient from "./components/RegisterProviderClient";

export default async function Page() {
  const currentUser = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <RegisterProviderClient user={currentUser} />
    </div>
  );
}
