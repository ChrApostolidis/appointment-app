import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  completeSignUpCustomerSchema,
  completeSignUpProviderSchema,
  signInSchema,
  signUpSchema,
} from "@/auth/schema";
import {
  completeSignUpAsCustomer,
  completeSignUpAsProvider,
  signIn,
  signUp,
} from "@/auth/actions";

export function useAuthForms() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>();

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
      role: "user" as const,
    },
    resolver: zodResolver(signUpSchema),
  });

  async function signUpHandler(data: z.infer<typeof signUpSchema>) {
    const error = await signUp(data);
    setError(error);
  }

  const handleCompleteSignUpAsProvider = useForm<z.infer<typeof completeSignUpProviderSchema>>({
    defaultValues: { userId: "", businessName: "", serviceCategory: "", description: "" },
    resolver: zodResolver(completeSignUpProviderSchema),
  });

  const handleCompleteSignUpAsCustomer = useForm<z.infer<typeof completeSignUpCustomerSchema>>({
    defaultValues: { userId: "", interests: "" },
    resolver: zodResolver(completeSignUpCustomerSchema),
  });

  async function completeSignUpAsProviderHandler(
    data: z.infer<typeof completeSignUpProviderSchema>
  ) {
    const error = await completeSignUpAsProvider(data);
    setError(error);
  }

  async function completeSignUpAsCustomerHandler(
    data: z.infer<typeof completeSignUpCustomerSchema>
  ) {
    const error = await completeSignUpAsCustomer(data);
    setError(error);
  }

  const toggleMode = () => setIsSignUp(!isSignUp);

  return {
    // State
    isSignUp,
    setIsSignUp,
    error,
    setError,

    // Form instances
    handleSignIn,
    handleSignUp,
    handleCompleteSignUpAsProvider,
    handleCompleteSignUpAsCustomer,

    // Handlers
    signInHandler,
    signUpHandler,
    toggleMode,
    completeSignUpAsProviderHandler,
    completeSignUpAsCustomerHandler
  };
}

export type AuthFormsReturn = ReturnType<typeof useAuthForms>;
