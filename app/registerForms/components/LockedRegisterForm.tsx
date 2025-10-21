import { FaLock } from "react-icons/fa";
import { getCurrentUser } from "@/auth/currentUser";

export default async function LockedRegisterForm() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <FaLock className="w-5 h-5 text-slate-400" />
          Account Information
        </h2>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={currentUser?.name || "John Doe"}
              name="name"
              disabled
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
            />
            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder={currentUser?.email || "john.doe@example.com"}
              disabled
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
            />
            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>
      {/* Line spacing */}
      <div className="border-t border-slate-700"></div>
    </>
  );
}
