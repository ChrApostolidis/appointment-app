"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { FOCUS_RING } from "./ConversationList";

export const MAX_MESSAGE_LENGTH = 2000;
const COUNTER_THRESHOLD = 1800;
const MIN_TEXTAREA_HEIGHT = 80; // ~3 rows
const MAX_TEXTAREA_HEIGHT = 220; // ~10 rows

export default function MessageComposer({
  onSend,
  sending,
}: {
  onSend: (body: string) => void;
  sending: boolean;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start at ~3 rows and auto-grow up to ~10 rows
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(
      Math.max(el.scrollHeight, MIN_TEXTAREA_HEIGHT),
      MAX_TEXTAREA_HEIGHT,
    )}px`;
  }, [text]);

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !sending;

  const submit = () => {
    if (!canSend) return;
    onSend(trimmed);
    setText("");
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-border bg-card px-3 py-3 shrink-0">
      <div className="flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !e.nativeEvent.isComposing
            ) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type a message..."
          aria-label="Message"
          className={`no-scrollbar flex-1 resize-none rounded-2xl bg-second-background text-foreground placeholder:text-muted-foreground border border-border px-4 py-2.5 text-sm leading-5 ${FOCUS_RING} focus-visible:outline-offset-0`}
          style={{
            minHeight: MIN_TEXTAREA_HEIGHT,
            maxHeight: MAX_TEXTAREA_HEIGHT,
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className={`shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-hover transition-colors ${FOCUS_RING}`}
        >
          <SendHorizontal size={18} />
        </button>
      </div>
      {text.length > COUNTER_THRESHOLD && (
        <p
          className={`text-xs mt-1 text-right ${
            text.length >= MAX_MESSAGE_LENGTH
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {text.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  );
}
