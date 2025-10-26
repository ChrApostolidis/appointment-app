"use client";
import { FaFileAlt } from "react-icons/fa";

export default function RegisterCustomerClient() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">Interests</h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Interests <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <FaFileAlt className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <textarea
              name="description"
              rows={4}
              maxLength={250}
              placeholder="Describe your interests..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <p className="mt-1 text-sm text-slate-400">Minimum 250 characters</p>
        </div>

        <button className="cursor-pointer w-full bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/50 transform hover:-translate-y-0.5">
          Complete Registration
        </button>
      </div>

      <p className="text-center text-sm text-slate-400">
        By completing registration, you agree to our Terms of Service and
        Privacy Policy
      </p>
    </div>
  );
}
