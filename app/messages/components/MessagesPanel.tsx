"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, MessageCircle, RotateCw, X } from "lucide-react";
import type { userType } from "@/app/registerForms/components/LockedRegisterForm";
import {
  getConversations,
  type ChatMessage,
  type ConversationSummary,
} from "@/app/messages/actions/actions";
import ConversationList, { FOCUS_RING } from "./ConversationList";
import ChatWindow from "./ChatWindow";

const CONVERSATIONS_POLL_MS = 10_000;

export type MessagesPanelRequest = {
  // Bumped on every open request so the panel resets to the asked-for view
  key: number;
  conversationId: string | null;
};

function sortByRecent(list: ConversationSummary[]) {
  return [...list].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
}

export default function MessagesPanel({
  user,
  request,
  onClose,
}: {
  user: userType;
  request: MessagesPanelRequest | null;
  onClose: () => void;
}) {
  const isOpen = request !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {request && (
        <>
          <motion.div
            key="messages-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
            aria-hidden="true"
          />
          <motion.aside
            key="messages-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 z-[70] h-dvh w-full sm:w-[420px] bg-card border-l border-border shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Messages"
          >
            <PanelContent
              key={request.key}
              user={user}
              initialConversationId={request.conversationId}
              onClose={onClose}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  user,
  initialConversationId,
  onClose,
}: {
  user: userType;
  initialConversationId: string | null;
  onClose: () => void;
}) {
  const [conversations, setConversations] = useState<
    ConversationSummary[] | null
  >(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversationId,
  );
  const [notFound, setNotFound] = useState(false);

  const selectedIdRef = useRef(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const refresh = useCallback(async () => {
    try {
      const res = await getConversations();
      if (!res.ok) {
        setLoadError(res.error);
        return;
      }
      setLoadError(null);
      // The open conversation is being read live, so never show it as unread
      setConversations(
        sortByRecent(
          res.data.map((c) =>
            c.id === selectedIdRef.current ? { ...c, unreadCount: 0 } : c,
          ),
        ),
      );
    } catch {
      setLoadError("Something went wrong. Please check your connection.");
    }
  }, []);

  // Load on open, then poll while the tab is visible
  useEffect(() => {
    let inFlight = false;
    const tick = async () => {
      if (document.visibilityState !== "visible" || inFlight) return;
      inFlight = true;
      await refresh();
      inFlight = false;
    };

    void tick();
    const intervalId = setInterval(tick, CONVERSATIONS_POLL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  const selected =
    selectedId && conversations
      ? (conversations.find((c) => c.id === selectedId) ?? null)
      : null;

  // A requested conversation that isn't in the list: fall back to the list
  if (selectedId && conversations && !selected) {
    setSelectedId(null);
    setNotFound(true);
  }

  const handleSelect = (id: string) => {
    setNotFound(false);
    setSelectedId(id);
  };

  const handleRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev?.some((c) => c.id === conversationId && c.unreadCount > 0)
        ? prev.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c,
          )
        : prev,
    );
  }, []);

  const handleSent = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setConversations((prev) => {
        const target = prev?.find((c) => c.id === conversationId);
        if (!prev || !target) return prev;
        const updated: ConversationSummary = {
          ...target,
          lastMessagePreview: message.body,
          lastMessageSenderIsMe: true,
          lastMessageAt: message.createdAt,
        };
        return [updated, ...prev.filter((c) => c.id !== conversationId)];
      });
    },
    [],
  );

  if (selected) {
    return (
      <ChatWindow
        key={selected.id}
        conversation={selected}
        userId={user.id}
        onBack={() => setSelectedId(null)}
        onClose={onClose}
        onRead={handleRead}
        onSent={handleSent}
      />
    );
  }

  const totalUnread =
    conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Messages</h2>
          {totalUnread > 0 && (
            <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
              {totalUnread} new
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close messages"
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-second-background cursor-pointer transition-colors ${FOCUS_RING}`}
        >
          <X size={20} />
        </button>
      </div>

      {notFound && (
        <div
          role="alert"
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border-b border-border shrink-0"
        >
          <AlertCircle size={14} className="shrink-0" />
          That conversation could not be found.
        </div>
      )}

      {conversations === null && loadError === null && <ListSkeleton />}

      {conversations === null && loadError !== null && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-foreground font-semibold">
            Could not load your messages
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setLoadError(null);
              void refresh();
            }}
            className={`inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-primary-hover transition-colors ${FOCUS_RING}`}
          >
            <RotateCw size={14} />
            Try again
          </button>
        </div>
      )}

      {conversations !== null && conversations.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-full bg-second-background flex items-center justify-center mb-4">
            <MessageCircle size={26} className="text-muted-foreground" />
          </div>
          <p className="text-foreground text-xl font-semibold">
            No conversations yet
          </p>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs">
            {user.role === "user"
              ? "Message a provider from their profile page."
              : "When customers message you, conversations appear here."}
          </p>
          {user.role === "user" && (
            <Link
              href="/book"
              onClick={onClose}
              className={`mt-5 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors ${FOCUS_RING}`}
            >
              Browse providers
            </Link>
          )}
        </div>
      )}

      {conversations !== null && conversations.length > 0 && (
        <div className="flex-1 min-h-0">
          <ConversationList
            conversations={conversations}
            selectedId={null}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div
      className="flex-1 min-h-0 overflow-hidden flex flex-col"
      aria-busy="true"
      aria-label="Loading conversations"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 border-b border-border/60"
        >
          <div className="w-12 h-12 rounded-full bg-second-background animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3.5 w-1/2 rounded bg-second-background animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-second-background animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
