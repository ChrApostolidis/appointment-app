"use client";

import { format } from "date-fns";
import type { ConversationSummary } from "@/app/messages/actions/actions";
import Avatar from "./Avatar";

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function shortTime(iso: string): string {
  const date = new Date(iso);
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return format(date, "d MMM");
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <ul className="no-scrollbar flex-1 overflow-y-auto min-h-0">
        {conversations.map((c) => {
          const selected = c.id === selectedId;
          const hasUnread = c.unreadCount > 0;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={selected ? "true" : undefined}
                aria-label={`Open conversation with ${c.otherPartyName}${
                  hasUnread ? `, ${c.unreadCount} unread` : ""
                }`}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer border-b border-border/60 transition-colors ${FOCUS_RING} focus-visible:-outline-offset-2 ${
                  selected ? "bg-second-background" : "hover:bg-second-background/60"
                }`}
              >
                <Avatar name={c.otherPartyName} logoUrl={c.otherPartyLogoUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={`truncate text-foreground ${
                        hasUnread ? "font-bold" : "font-semibold"
                      }`}
                    >
                      {c.otherPartyName}
                    </p>
                    <span
                      className="shrink-0 text-xs text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {shortTime(c.lastMessageAt)}
                    </span>
                  </div>
                  {c.otherPartySubtitle && (
                    <p className="truncate text-xs text-muted-foreground">
                      {c.otherPartySubtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={`truncate text-sm ${
                        hasUnread
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {c.lastMessagePreview
                        ? `${c.lastMessageSenderIsMe ? "You: " : ""}${c.lastMessagePreview}`
                        : "No messages yet"}
                    </p>
                    {hasUnread && (
                      <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                        {c.unreadCount > 99 ? "99+" : c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
