"use client";
import { FaBuilding, FaFileAlt, FaTag } from "react-icons/fa";
import { categories } from "../../data";
import { useAuthForms } from "@/auth/hooks/useAuthForms";

export default function RegisterProviderClient() {
  const {
    completeSignUpAsProviderHandler,
    error,
    handleCompleteSignUpAsProvider,
  } = useAuthForms();
  return (
    <div className="p-8 space-y-6">
      <form
        onSubmit={handleCompleteSignUpAsProvider.handleSubmit(
          completeSignUpAsProviderHandler
        )}
      >
        <div className="space-y-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
                {...handleCompleteSignUpAsProvider.register("businessName")}
                placeholder="Enter your business name"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            {handleCompleteSignUpAsProvider.formState.errors.businessName && (
              <p className="text-red-500 text-sm">
                {
                  handleCompleteSignUpAsProvider.formState.errors.businessName
                    .message
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Service Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <select
                {...handleCompleteSignUpAsProvider.register("serviceCategory")}
                defaultValue={categories[0]?.name}
                className="w-full pl-11 pr-10 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} className="bg-slate-800">
                    {category.name}
                  </option>
                ))}
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
            {handleCompleteSignUpAsProvider.formState.errors
              .serviceCategory && (
              <p className="text-red-500 text-sm">
                {
                  handleCompleteSignUpAsProvider.formState.errors
                    .serviceCategory.message
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Business Description <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FaFileAlt className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                {...handleCompleteSignUpAsProvider.register("description")}
                rows={4}
                maxLength={250}
                placeholder="Describe your business and services..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
              {handleCompleteSignUpAsProvider.formState.errors.description && (
                <p className="text-red-500 text-sm">
                  {
                    handleCompleteSignUpAsProvider.formState.errors.description
                      .message
                  }
                </p>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Minimum 250 characters
            </p>
          </div>
        </div>

        <button
          disabled={handleCompleteSignUpAsProvider.formState.isSubmitting}
          className="cursor-pointer w-full bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-500 hover:to-sky-500 transition-all duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/50 transform hover:-translate-y-0.5"
        >
          {handleCompleteSignUpAsProvider.formState.isSubmitting
            ? "Registering..."
            : "Complete Registration"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400">
        By completing registration, you agree to our Terms of Service and
        Privacy Policy
      </p>
    </div>
  );
}
