"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { userType } from "../registerForms/components/LockedRegisterForm";
import Profile from "./Profile";
import NavMenu from "./NavMenu";
import BurgerButton from "./BurgerButton";
import MobileDrawer from "./MobileDrawer";
import Link from "next/link";
import { getUnreadCount } from "@/app/messages/actions/actions";
import MessagesPanel, {
  type MessagesPanelRequest,
} from "@/app/messages/components/MessagesPanel";
import {
  OPEN_MESSAGES_EVENT,
  UNREAD_MESSAGES_CHANGED_EVENT,
  type OpenMessagesDetail,
} from "@/app/messages/events";

const UNREAD_POLL_INTERVAL_MS = 30_000;

export default function Header({ user }: { user: userType | null }) {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messagesRequest, setMessagesRequest] =
    useState<MessagesPanelRequest | null>(null);

  const canMessage = user?.role === "user" || user?.role === "provider";

  const openMessages = useCallback((conversationId?: string) => {
    setMenuOpen(false);
    setMessagesRequest((prev) => ({
      key: (prev?.key ?? 0) + 1,
      conversationId: conversationId ?? null,
    }));
  }, []);

  const closeMessages = useCallback(() => setMessagesRequest(null), []);

  // Lets other components (e.g. "Message Provider") open the panel
  useEffect(() => {
    if (!canMessage) return;
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenMessagesDetail>).detail;
      openMessages(detail?.conversationId);
    };
    window.addEventListener(OPEN_MESSAGES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MESSAGES_EVENT, onOpen);
  }, [canMessage, openMessages]);

  useEffect(() => {
    if (!canMessage) return;

    let cancelled = false;
    const refresh = async () => {
      try {
        const count = await getUnreadCount();
        if (!cancelled) setUnreadCount(count);
      } catch {
        // Ignore transient failures; the next poll will retry.
      }
    };

    refresh();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, UNREAD_POLL_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(UNREAD_MESSAGES_CHANGED_EVENT, refresh);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(UNREAD_MESSAGES_CHANGED_EVENT, refresh);
    };
  }, [canMessage]);

  const visibleUnreadCount = canMessage ? unreadCount : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent layout shift when header is fixed */}
      <div className="h-20"></div>
      <header
        className={`h-20 fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isSticky ? "bg-second-background shadow-lg" : "bg-second-background"
        }`}
      >
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center ">
            <Link href="/" className="ml-2">
              <div className="flex items-center justify-center">
                <Image
                  src="/app-logo.png"
                  alt="App Logo"
                  width={64}
                  height={64}
                />
                <p className="text-xl lg:text-2xl">
                  Appoint<span className="text-primary">Me</span>
                </p>
              </div>
            </Link>
          </div>
          <NavMenu user={user} />

          <div className="hidden lg:flex">
            {user ? (
              <>
                <Profile
                  user={user}
                  unreadCount={visibleUnreadCount}
                  onOpenMessages={canMessage ? () => openMessages() : undefined}
                />
              </>
            ) : (
              <div>
                <Link
                  href="/authPage"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  Login / Register
                </Link>
              </div>
            )}
          </div>
          <BurgerButton
            isOpen={menuOpen}
            onToggle={() => setMenuOpen((s) => !s)}
            hasUnread={visibleUnreadCount > 0}
          />
        </div>
      </header>
      <MobileDrawer
        user={user}
        unreadCount={visibleUnreadCount}
        onOpenMessages={canMessage ? () => openMessages() : undefined}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      {user && canMessage && (
        <MessagesPanel
          user={user}
          request={messagesRequest}
          onClose={closeMessages}
        />
      )}
    </>
  );
}
