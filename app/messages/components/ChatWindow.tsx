"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import { AlertCircle, ArrowLeft, RotateCw, X } from "lucide-react";
import {
  getMessages,
  markConversationRead,
  sendMessage,
  type ChatMessage,
  type ConversationSummary,
} from "@/app/messages/actions/actions";
import { notifyUnreadMessagesChanged } from "@/app/messages/events";
import Avatar from "./Avatar";
import MessageComposer from "./MessageComposer";
import { FOCUS_RING } from "./ConversationList";

const POLL_INTERVAL_MS = 3000;
const NEAR_BOTTOM_PX = 120;
const NETWORK_ERROR = "Something went wrong. Please check your connection.";

type LocalMessage = ChatMessage & { status?: "pending" | "failed" };

function toTime(iso: string) {
  return new Date(iso).getTime();
}

function mergeMessages(
  prev: LocalMessage[],
  incoming: ChatMessage[],
): LocalMessage[] {
  const byId = new Map(prev.map((m) => [m.id, m]));
  let changed = false;
  for (const m of incoming) {
    if (!byId.has(m.id)) {
      byId.set(m.id, m);
      changed = true;
    }
  }
  if (!changed) return prev;
  return [...byId.values()].sort((a, b) => toTime(a.createdAt) - toTime(b.createdAt));
}

function dayLabel(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, d MMMM yyyy");
}

export default function ChatWindow({
  conversation,
  userId,
  onBack,
  onClose,
  onRead,
  onSent,
}: {
  conversation: ConversationSummary;
  userId: string;
  onBack: () => void;
  onClose?: () => void;
  onRead: (conversationId: string) => void;
  onSent: (conversationId: string, message: ChatMessage) => void;
}) {
  const conversationId = conversation.id;

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevLastIdRef = useRef<string | undefined>(undefined);
  const lastCreatedAtRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const sendingRef = useRef(false);
  const tempCounterRef = useRef(0);

  const onReadRef = useRef(onRead);
  const onSentRef = useRef(onSent);
  useEffect(() => {
    onReadRef.current = onRead;
    onSentRef.current = onSent;
  });

  const trackServerMessages = useCallback((list: ChatMessage[]) => {
    for (const m of list) {
      seenIdsRef.current.add(m.id);
      const last = lastCreatedAtRef.current;
      if (last === null || toTime(m.createdAt) > toTime(last)) {
        lastCreatedAtRef.current = m.createdAt;
      }
    }
  }, []);

  const markRead = useCallback(async () => {
    try {
      const res = await markConversationRead(conversationId);
      if (!res.ok) return;
      onReadRef.current(conversationId);
      notifyUnreadMessagesChanged();
    } catch {
      // Non-critical; it will be retried the next time messages arrive.
    }
  }, [conversationId]);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let res;
      try {
        res = await getMessages(conversationId);
      } catch {
        res = { ok: false as const, error: NETWORK_ERROR };
      }
      if (cancelled) return;
      if (!res.ok) {
        setLoadError(res.error);
        setStatus("error");
        return;
      }
      trackServerMessages(res.data);
      stickToBottomRef.current = true;
      setMessages((prev) => mergeMessages(prev, res.data));
      setStatus("ready");
      void markRead();
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, reloadToken, trackServerMessages, markRead]);

  // Polling for new messages (only while the tab is visible)
  useEffect(() => {
    if (status !== "ready") return;
    let cancelled = false;
    let inFlight = false;

    const tick = async () => {
      if (document.visibilityState !== "visible" || inFlight) return;
      inFlight = true;
      try {
        const res = await getMessages(
          conversationId,
          lastCreatedAtRef.current ?? undefined,
        );
        if (cancelled || !res.ok) return;
        const fresh = res.data.filter((m) => !seenIdsRef.current.has(m.id));
        trackServerMessages(res.data);
        if (fresh.length === 0) return;
        setMessages((prev) => mergeMessages(prev, fresh));
        if (fresh.some((m) => m.senderId !== userId)) void markRead();
      } catch {
        // Ignore transient polling errors; the next tick retries.
      } finally {
        inFlight = false;
      }
    };

    const intervalId = setInterval(tick, POLL_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [status, conversationId, userId, trackServerMessages, markRead]);

  // Auto-scroll when a new last message appears and the user is near the bottom
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const lastId = messages[messages.length - 1]?.id;
    if (lastId === prevLastIdRef.current) return;
    prevLastIdRef.current = lastId;
    if (stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stickToBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
  };

  const deliver = useCallback(
    async (tempId: string, body: string) => {
      if (sendingRef.current) return;
      sendingRef.current = true;
      setSending(true);
      setSendError(null);
      stickToBottomRef.current = true;
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "pending" } : m)),
      );

      let res;
      try {
        res = await sendMessage(conversationId, body);
      } catch {
        res = { ok: false as const, error: NETWORK_ERROR };
      }

      if (res.ok) {
        const saved = res.data;
        seenIdsRef.current.add(saved.id);
        setMessages((prev) =>
          mergeMessages(
            prev.filter((m) => m.id !== tempId),
            [saved],
          ),
        );
        onSentRef.current(conversationId, saved);
      } else {
        setSendError(res.error);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m)),
        );
      }
      sendingRef.current = false;
      setSending(false);
    },
    [conversationId],
  );

  const handleSend = (body: string) => {
    tempCounterRef.current += 1;
    const tempId = `temp-${Date.now()}-${tempCounterRef.current}`;
    const temp: LocalMessage = {
      id: tempId,
      senderId: userId,
      body,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    stickToBottomRef.current = true;
    setMessages((prev) => [...prev, temp]);
    void deliver(tempId, body);
  };

  const handleRetry = (message: LocalMessage) => {
    void deliver(message.id, message.body);
  };

  const reload = () => {
    setStatus("loading");
    setLoadError(null);
    setReloadToken((t) => t + 1);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 lg:px-4 py-3 border-b border-border bg-card shrink-0">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-second-background cursor-pointer transition-colors ${FOCUS_RING}`}
        >
          <ArrowLeft size={20} />
        </button>
        <Avatar
          name={conversation.otherPartyName}
          logoUrl={conversation.otherPartyLogoUrl}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-foreground font-semibold truncate">
            {conversation.otherPartyName}
          </h2>
          {conversation.otherPartySubtitle && (
            <p className="text-xs text-muted-foreground truncate">
              {conversation.otherPartySubtitle}
            </p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close messages"
            className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-second-background cursor-pointer transition-colors ${FOCUS_RING}`}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      {status === "loading" && <MessagesSkeleton />}

      {status === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <p className="text-foreground font-semibold">
            Could not load messages
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">{loadError}</p>
          <button
            type="button"
            onClick={reload}
            className={`inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-primary-hover transition-colors ${FOCUS_RING}`}
          >
            <RotateCw size={14} />
            Try again
          </button>
        </div>
      )}

      {status === "ready" && (
        <>
          <div
            ref={listRef}
            onScroll={handleScroll}
            role="log"
            aria-live="polite"
            aria-label="Messages"
            className="no-scrollbar flex-1 min-h-0 overflow-y-auto px-3 lg:px-6 py-4 flex flex-col gap-1.5"
          >
            {messages.length === 0 && (
              <p className="m-auto text-sm text-muted-foreground text-center">
                No messages yet. Say hello!
              </p>
            )}
            {messages.map((m, i) => {
              const date = new Date(m.createdAt);
              const prev = messages[i - 1];
              const showDay = !prev || !isSameDay(new Date(prev.createdAt), date);
              return (
                <div key={m.id} className="flex flex-col gap-1.5">
                  {showDay && (
                    <div className="flex justify-center my-2">
                      <span className="text-xs text-muted-foreground bg-second-background rounded-full px-3 py-1">
                        {dayLabel(date)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={m}
                    mine={m.senderId === userId}
                    time={format(date, "HH:mm")}
                    onRetry={() => handleRetry(m)}
                    retryDisabled={sending}
                  />
                </div>
              );
            })}
          </div>

          {sendError && (
            <div
              role="alert"
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border-t border-border shrink-0"
            >
              <AlertCircle size={14} className="shrink-0" />
              <span className="min-w-0 break-words">{sendError}</span>
            </div>
          )}

          <MessageComposer onSend={handleSend} sending={sending} />
        </>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  mine,
  time,
  onRetry,
  retryDisabled,
}: {
  message: LocalMessage;
  mine: boolean;
  time: string;
  onRetry: () => void;
  retryDisabled: boolean;
}) {
  const failed = message.status === "failed";
  const pending = message.status === "pending";

  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${
          mine
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        } ${pending ? "opacity-60" : ""} ${
          failed ? "ring-2 ring-red-500" : ""
        }`}
      >
        {message.body}
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
        {failed ? (
          <>
            <span className="text-red-500">Failed to send</span>
            <button
              type="button"
              onClick={onRetry}
              disabled={retryDisabled}
              aria-label="Retry sending message"
              className={`inline-flex items-center gap-1 text-primary font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded ${FOCUS_RING}`}
            >
              <RotateCw size={11} />
              Retry
            </button>
          </>
        ) : pending ? (
          <span>Sending...</span>
        ) : (
          <span>{time}</span>
        )}
      </div>
    </div>
  );
}

function MessagesSkeleton() {
  const rows = [
    "w-48 self-start",
    "w-64 self-end",
    "w-40 self-start",
    "w-56 self-end",
    "w-52 self-start",
  ];
  return (
    <div
      className="flex-1 min-h-0 overflow-hidden px-3 lg:px-6 py-4 flex flex-col gap-3"
      aria-busy="true"
      aria-label="Loading messages"
    >
      {rows.map((cls, i) => (
        <div
          key={i}
          className={`h-10 rounded-2xl bg-second-background animate-pulse ${cls}`}
        />
      ))}
    </div>
  );
}
