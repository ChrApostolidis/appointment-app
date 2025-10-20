"use client";
import { FaLock, FaBuilding, FaFileAlt, FaTag } from "react-icons/fa";

export default function RegisterForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Complete Your Registration
            </h1>
            <p className="text-indigo-100">
              Fill in your business details to get started
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
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
                    disabled
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                  />
                  <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700"></div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-200">
                Business Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter your business name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Service Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
                  <select
                    name="serviceCategory"
                    className="w-full pl-11 pr-10 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">
                      Select a category
                    </option>
                    <option value="health" className="bg-slate-800">
                      Health & Wellness
                    </option>{" "}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Business Description <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe your business and services..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Minimum 50 characters
                </p>
              </div>
            </div>

            <button className="w-full bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/50 transform hover:-translate-y-0.5">
              Complete Registration
            </button>

            <p className="text-center text-sm text-slate-400">
              By completing registration, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
