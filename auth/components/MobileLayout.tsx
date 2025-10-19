import { RolePick } from "@/app/authPage/components/RolePick";
import { useAuthForms } from "../hooks/useAuthForms";

export default function MobileLayout() {
  const {
    isSignUp,
    setIsSignUp,
    error,
    handleSignIn,
    handleSignUp,
    signInHandler,
    signUpHandler,
  } = useAuthForms();

  return (
    <div className="md:hidden w-full max-w-sm">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-6">
        {/* Mobile Toggle Buttons */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              !isSignUp
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              isSignUp
                ? "bg-cyan-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Forms */}
        {!isSignUp ? (
          <form
            onSubmit={handleSignIn.handleSubmit(signInHandler)}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">Sign in to your account</p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              {...handleSignIn.register("email")}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
            />
            {handleSignIn.formState.errors.email && (
              <p className="text-red-500 text-xs">
                {handleSignIn.formState.errors.email.message}
              </p>
            )}

            <input
              type="password"
              placeholder="Password"
              {...handleSignIn.register("password")}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
            />
            {handleSignIn.formState.errors.password && (
              <p className="text-red-500 text-xs">
                {handleSignIn.formState.errors.password.message}
              </p>
            )}

            <button
              disabled={handleSignIn.formState.isSubmitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium text-white transition"
            >
              {handleSignIn.formState.isSubmitting
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSignUp.handleSubmit(signUpHandler)}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-100 mb-2">
                Create Account
              </h1>
              <p className="text-gray-400 text-sm">Join us today</p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <input
              type="text"
              placeholder="Full Name"
              {...handleSignUp.register("name")}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
            />
            {handleSignUp.formState.errors.name && (
              <p className="text-red-500 text-xs">
                {handleSignUp.formState.errors.name.message}
              </p>
            )}

            <input
              type="email"
              placeholder="Email"
              {...handleSignUp.register("email")}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
            />
            {handleSignUp.formState.errors.email && (
              <p className="text-red-500 text-xs">
                {handleSignUp.formState.errors.email.message}
              </p>
            )}

            <input
              type="password"
              placeholder="Password"
              {...handleSignUp.register("password")}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
            />
            {handleSignUp.formState.errors.password && (
              <p className="text-red-500 text-xs">
                {handleSignUp.formState.errors.password.message}
              </p>
            )}

            <RolePick
              value={handleSignUp.watch("role")}
              onChange={(role: "user" | "provider") =>
                handleSignUp.setValue("role", role)
              }
            />

            <button
              disabled={handleSignUp.formState.isSubmitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium text-white transition"
            >
              {handleSignUp.formState.isSubmitting
                ? "Signing Up..."
                : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
