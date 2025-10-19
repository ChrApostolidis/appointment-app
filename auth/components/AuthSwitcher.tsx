"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signUp } from "@/auth/actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signUpSchema } from "@/auth/schema";
import { useForm } from "react-hook-form";
import { ToggleButton } from "@/app/authPage/components/RolePick";

const AuthSwitcher: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>();

  const toggleMode = () => setIsSignUp(!isSignUp);

  const toggleSlidePanel = {
    initialLeft: {
      x: "-100%",
      borderTopLeftRadius: 150,
      borderBottomLeftRadius: 150,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    initialRight: {
      x: "0%",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 150,
      borderBottomRightRadius: 150,
    },
    animateLeft: {
      x: "-100%",
      borderTopLeftRadius: 150,
      borderBottomLeftRadius: 150,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    animateRight: {
      x: "0%",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 150,
      borderBottomRightRadius: 150,
    },
  };

  // Sign In form handling
  const handleSignIn = useForm<z.infer<typeof signInSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  async function signInHandler(data: z.infer<typeof signInSchema>) {
    const error = await signIn(data);
    setError(error);
  }

  // Sign Up form handling
  const handleSignUp = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    resolver: zodResolver(signUpSchema),
  });

  async function signUpHandler(data: z.infer<typeof signUpSchema>) {
    const error = await signUp(data);
    setError(error);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {/* Mobile Layout - Simple Stack */}
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

              <ToggleButton
                value={handleSignUp.watch("role")}
                onChange={(role) => handleSignUp.setValue("role", role)}
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

      {/* Desktop/Tablet Layout - Animated */}
      <div className="hidden md:block relative w-[768px] h-[500px] bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Sign In */}

        <form
          onSubmit={handleSignIn.handleSubmit(signInHandler)}
          className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-8 text-gray-100"
          style={{
            opacity: isSignUp ? 0 : 1,
            pointerEvents: isSignUp ? "none" : "auto",
          }}
        >
          <h1 className="text-3xl font-bold mb-4">Sign In</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p className="text-gray-400 mb-6 text-sm">
            Access your account to continue
          </p>

          <input
            type="email"
            placeholder="Email"
            {...handleSignIn.register("email")}
            className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
          />
          {handleSignIn.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {handleSignIn.formState.errors.email.message}
            </p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...handleSignIn.register("password")}
            className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
          />
          {handleSignIn.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {handleSignIn.formState.errors.password.message}
            </p>
          )}

          <button
            disabled={handleSignIn.formState.isSubmitting}
            className="w-full py-2 mt-4 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition"
          >
            {handleSignIn.formState.isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* ===== Sign Up ===== */}
        <form
          onSubmit={handleSignUp.handleSubmit(signUpHandler)}
          className="absolute top-0 left-1/2 w-1/2 h-full flex flex-col items-center justify-center p-8 text-gray-100"
          style={{
            opacity: isSignUp ? 1 : 0,
            pointerEvents: isSignUp ? "auto" : "none",
          }}
        >
          <h1 className="text-3xl font-bold mb-4">Create Account</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p className="text-gray-400 mb-6 text-sm">
            Join us and start your journey
          </p>

          <input
            type="text"
            placeholder="Full Name"
            {...handleSignUp.register("name")}
            className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
          />
          {handleSignUp.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {handleSignUp.formState.errors.name.message}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...handleSignUp.register("email")}
            className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
          />
          {handleSignUp.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {handleSignUp.formState.errors.email.message}
            </p>
          )}
          <input
            type="password"
            placeholder="Password"
            {...handleSignUp.register("password")}
            className="w-full px-4 py-2 mb-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
          />
          {handleSignUp.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {handleSignUp.formState.errors.password.message}
            </p>
          )}
          <div>
            {handleSignUp.watch("role") === "user" ? "User" : "Provider"}
          </div>
          <ToggleButton
            value={handleSignUp.watch("role")}
            onChange={(role) => handleSignUp.setValue("role", role)}
          />

          <button
            disabled={handleSignUp.formState.isSubmitting}
            className="w-full py-2 mt-4 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-medium transition"
          >
            {handleSignUp.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Sliding Panel */}
        <motion.div
          className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 text-white flex flex-col items-center justify-center p-8"
          initial={
            isSignUp
              ? toggleSlidePanel.initialLeft
              : toggleSlidePanel.initialRight
          }
          animate={
            isSignUp
              ? toggleSlidePanel.animateLeft
              : toggleSlidePanel.animateRight
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "panel-signup" : "panel-signin"}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.45, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                x: isSignUp ? -20 : 20,
                transition: { duration: 0.35, ease: "easeIn" },
              }}
              className="flex flex-col items-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, ease: "circOut" },
                }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="text-3xl font-bold mb-4"
              >
                {isSignUp ? "Welcome" : "Welcome Back!"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, ease: "circOut" },
                }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="mb-6 text-center text-gray-100 max-w-[260px]"
              >
                {isSignUp
                  ? "Register with your personal details to use all site features"
                  : "Enter your details to access your account"}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, ease: "circOut" },
                }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                onClick={toggleMode}
                className="py-2 px-6 bg-transparent border border-white rounded-lg font-medium hover:bg-white/10 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {!isSignUp ? "Sign Up" : "Sign In"}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthSwitcher;
