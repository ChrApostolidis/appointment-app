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
} from "@/auth/actions/actions";
import { getSignedURL } from "@/auth/actions/uploadActions";
import { computeSHA256 } from "../utils/helper";

export function useAuthForms() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>();
  const [statusMessage, setStatusMessage] = useState("");
  const [providerFile, setProviderFile] = useState<File | undefined>();

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

  const handleCompleteSignUpAsProvider = useForm<
    z.infer<typeof completeSignUpProviderSchema>
  >({
    defaultValues: {
      userId: "",
      businessName: "",
      serviceCategory: "",
      description: "",
    },
    resolver: zodResolver(completeSignUpProviderSchema),
  });

  const handleCompleteSignUpAsCustomer = useForm<
    z.infer<typeof completeSignUpCustomerSchema>
  >({
    defaultValues: { userId: "", interests: "" },
    resolver: zodResolver(completeSignUpCustomerSchema),
  });

  async function completeSignUpAsProviderHandler(
    data: z.infer<typeof completeSignUpProviderSchema>
  ) {
    if (!providerFile) {
      console.log("ERROR: No file selected");
      setError("Please select a business logo");
      return;
    }

    // Upload the file first
    const uploadResult = await uploadImageToS3(providerFile);
    if (!uploadResult) {
      console.log("Upload failed!");
      return;
    }
    console.log("Upload successful:", uploadResult);

    // Merge upload result with form data
    const mergedData: z.infer<typeof completeSignUpProviderSchema> = {
      ...data,
      logoId: uploadResult.logoId,
      logoUrl: uploadResult.logoUrl,
    };

    setStatusMessage("Completing registration...");
    const error = await completeSignUpAsProvider(mergedData);
    setError(error);
    setStatusMessage("");
  }

  async function completeSignUpAsCustomerHandler(
    data: z.infer<typeof completeSignUpCustomerSchema>
  ) {
    const error = await completeSignUpAsCustomer(data);
    setError(error);
  }

  // Upload image to S3
  async function uploadImageToS3(
    file: File
  ): Promise<{ logoId: string; logoUrl: string } | null> {
    try {
      setStatusMessage("Uploading logo...");

      const checksum = await computeSHA256(file);

      const signedUrlResponse = await getSignedURL(
        file.type,
        file.size,
        checksum
      );

      if (signedUrlResponse.failure) {
        setError(signedUrlResponse.failure);
        setStatusMessage("");
        return null;
      }

      if (!signedUrlResponse.success) {
        setError("Failed to get signed URL");
        setStatusMessage("");
        return null;
      }

      const { url, key, logoUrl } = signedUrlResponse.success;

      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload");
      }

      return { logoId: key, logoUrl: logoUrl };
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setStatusMessage("");
      return null;
    }
  }

  const toggleMode = () => setIsSignUp(!isSignUp);

  return {
    // State
    isSignUp,
    setIsSignUp,
    error,
    setError,
    statusMessage,
    setStatusMessage,
    providerFile,
    setProviderFile,

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
    completeSignUpAsCustomerHandler,
  };
}

export type AuthFormsReturn = ReturnType<typeof useAuthForms>;
