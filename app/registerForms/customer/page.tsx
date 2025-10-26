import { getCurrentUser } from "@/auth/currentUser";
import HeaderRegisterForm from "../components/HeaderRegisterForm";
import LockedRegisterForm from "../components/LockedRegisterForm";
import RegisterCustomerClient from "./components/RegisterCustomerClient";

export default async function RegisterCustomerPage() {
  const currentUser = await getCurrentUser({
    withFullUser: true,
    redirectIfNotFound: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          <HeaderRegisterForm />
          <div className="p-8 space-y-6">
            <LockedRegisterForm user={currentUser} />
          </div>
            <RegisterCustomerClient />
        </div>
      </div>
    </div>
  );
}
