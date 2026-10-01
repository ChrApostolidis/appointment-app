"use client";

import { useState } from "react";
import { singleProvider } from "../../actions/actions";
import MainButton from "@/app/components/MainButton";
import { startConversation } from "@/app/messages/actions/actions";
import { openMessagesPanel } from "@/app/messages/events";

export default function ServiceSection({
  provider,
  providerId,
  userRole,
  currentUserId,
}: {
  provider: singleProvider;
  providerId: string;
  userRole: string;
  currentUserId: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canMessage = userRole === "user" && currentUserId !== providerId;

  const handleMessage = async () => {
    setIsPending(true);
    setError(null);
    try {
      const result = await startConversation(providerId);
      if (result.ok) {
        openMessagesPanel(result.data.conversationId);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setIsPending(false);
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-700/50 bg-background shadow-xl backdrop-blur-sm p-6 md:p-8">
      <div className="mb-4">
        <div className="h-1 w-12 bg-primary rounded-full mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          About Our Services
        </h2>
      </div>
      <p className="text-base leading-relaxed text-foreground mb-8">
        {provider.description}
      </p>
      {canMessage && (
        <>
          <MainButton
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleMessage}
            disabled={isPending}
          >
            {isPending ? "Opening chat…" : "Message Provider"}
          </MainButton>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
