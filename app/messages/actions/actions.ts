"use server";

import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import {
  conversationsTable,
  logoInfoTable,
  messagesTable,
  ProviderTable,
  UserTable,
  type Conversation,
} from "@/drizzle/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  gt,
  inArray,
  ne,
  or,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type ConversationSummary = {
  id: string;
  otherPartyName: string; // customer viewing → provider businessName; provider viewing → customer's name
  otherPartySubtitle: string | null; // customer viewing → provider's user name; provider viewing → null
  otherPartyLogoUrl: string | null; // customer viewing → provider logo url (via logoInfoTable) or null; provider viewing → null
  lastMessagePreview: string | null; // body of latest message truncated to 80 chars, null if none
  lastMessageSenderIsMe: boolean; // false if no messages
  lastMessageAt: string; // ISO string
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string; // ISO string
};

const PREVIEW_LENGTH = 80;
const INITIAL_MESSAGES_LIMIT = 100;
const POLL_MESSAGES_LIMIT = 200;
// createdAt is set when a request starts, so a message stamped earlier can
// commit after a poll already moved past it. Re-scan this window to catch it.
const POLL_OVERLAP_MS = 10_000;

const uuidSchema = z.string().uuid();
const afterSchema = z.string().datetime({ offset: true });
const bodySchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(2000, "Message is too long");

const NOT_AUTHENTICATED = "Not authenticated";
const NOT_FOUND = "Conversation not found";

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * Returns the conversation only if `userId` is its customer or provider.
 * Used by every action that receives a conversationId.
 */
async function getParticipantConversation(
  conversationId: string,
  userId: string
): Promise<Conversation | null> {
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(
      and(
        eq(conversationsTable.id, conversationId),
        or(
          eq(conversationsTable.customerId, userId),
          eq(conversationsTable.providerId, userId)
        )
      )
    )
    .limit(1);
  return conversation ?? null;
}

/** Condition: message was sent by the other party after my last-read time. */
function unreadCondition(userId: string) {
  return and(
    ne(messagesTable.senderId, userId),
    or(
      and(
        eq(conversationsTable.customerId, userId),
        gt(messagesTable.createdAt, conversationsTable.customerLastReadAt)
      ),
      and(
        eq(conversationsTable.providerId, userId),
        gt(messagesTable.createdAt, conversationsTable.providerLastReadAt)
      )
    )
  );
}

export async function startConversation(
  providerId: string
): Promise<ActionResult<{ conversationId: string }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };
  if (user.role !== "user") {
    return { ok: false, error: "Only customers can start a conversation" };
  }

  const parsed = uuidSchema.safeParse(providerId);
  if (!parsed.success) return { ok: false, error: "Provider not found" };
  if (parsed.data === user.id) {
    return { ok: false, error: "You cannot message yourself" };
  }

  try {
    const [provider] = await db
      .select({ userId: ProviderTable.userId })
      .from(ProviderTable)
      .where(eq(ProviderTable.userId, parsed.data))
      .limit(1);
    if (!provider) return { ok: false, error: "Provider not found" };

    // The unique (customerId, providerId) index guarantees concurrent calls
    // never create duplicates; the loser of the race simply selects the row.
    await db
      .insert(conversationsTable)
      .values({ customerId: user.id, providerId: provider.userId })
      .onConflictDoNothing({
        target: [conversationsTable.customerId, conversationsTable.providerId],
      });

    const [conversation] = await db
      .select({ id: conversationsTable.id })
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.customerId, user.id),
          eq(conversationsTable.providerId, provider.userId)
        )
      )
      .limit(1);
    if (!conversation) {
      return { ok: false, error: "Could not start the conversation" };
    }

    return { ok: true, data: { conversationId: conversation.id } };
  } catch (err) {
    console.error("Failed to start conversation:", err);
    return { ok: false, error: "Could not start the conversation" };
  }
}

export async function getConversations(): Promise<
  ActionResult<ConversationSummary[]>
> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  try {
    const customerUser = alias(UserTable, "customer_user");
    const providerUser = alias(UserTable, "provider_user");

    const rows = await db
      .select({
        id: conversationsTable.id,
        customerId: conversationsTable.customerId,
        lastMessageAt: conversationsTable.lastMessageAt,
        customerName: customerUser.name,
        providerUserName: providerUser.name,
        businessName: ProviderTable.businessName,
        logoUrl: logoInfoTable.logoUrl,
      })
      .from(conversationsTable)
      .innerJoin(customerUser, eq(conversationsTable.customerId, customerUser.id))
      .innerJoin(
        ProviderTable,
        eq(conversationsTable.providerId, ProviderTable.userId)
      )
      .innerJoin(providerUser, eq(ProviderTable.userId, providerUser.id))
      .leftJoin(logoInfoTable, eq(ProviderTable.logoId, logoInfoTable.logoId))
      .where(
        or(
          // Customer side: always visible, even before the first message.
          eq(conversationsTable.customerId, user.id),
          // Provider side: hide conversations where nobody has written yet.
          and(
            eq(conversationsTable.providerId, user.id),
            exists(
              db
                .select({ one: messagesTable.id })
                .from(messagesTable)
                .where(eq(messagesTable.conversationId, conversationsTable.id))
            )
          )
        )
      )
      .orderBy(desc(conversationsTable.lastMessageAt));

    if (rows.length === 0) return { ok: true, data: [] };

    const ids = rows.map((row) => row.id);

    const [latestRows, unreadRows] = await Promise.all([
      // Latest message per conversation (one row each).
      db
        .selectDistinctOn([messagesTable.conversationId], {
          conversationId: messagesTable.conversationId,
          body: messagesTable.body,
          senderId: messagesTable.senderId,
        })
        .from(messagesTable)
        .where(inArray(messagesTable.conversationId, ids))
        .orderBy(messagesTable.conversationId, desc(messagesTable.createdAt)),
      // Unread count per conversation.
      db
        .select({
          conversationId: messagesTable.conversationId,
          unread: count(),
        })
        .from(messagesTable)
        .innerJoin(
          conversationsTable,
          eq(messagesTable.conversationId, conversationsTable.id)
        )
        .where(
          and(
            inArray(messagesTable.conversationId, ids),
            unreadCondition(user.id)
          )
        )
        .groupBy(messagesTable.conversationId),
    ]);

    const latestByConversation = new Map(
      latestRows.map((row) => [row.conversationId, row])
    );
    const unreadByConversation = new Map(
      unreadRows.map((row) => [row.conversationId, row.unread])
    );

    const summaries: ConversationSummary[] = rows.map((row) => {
      const latest = latestByConversation.get(row.id);
      const iAmCustomer = row.customerId === user.id;
      return {
        id: row.id,
        otherPartyName: iAmCustomer ? row.businessName : row.customerName,
        otherPartySubtitle: iAmCustomer ? row.providerUserName : null,
        otherPartyLogoUrl: iAmCustomer ? (row.logoUrl ?? null) : null,
        lastMessagePreview: latest ? truncate(latest.body, PREVIEW_LENGTH) : null,
        lastMessageSenderIsMe: latest ? latest.senderId === user.id : false,
        lastMessageAt: row.lastMessageAt.toISOString(),
        unreadCount: unreadByConversation.get(row.id) ?? 0,
      };
    });

    return { ok: true, data: summaries };
  } catch (err) {
    console.error("Failed to fetch conversations:", err);
    return { ok: false, error: "Could not load conversations" };
  }
}

/**
 * Returns messages oldest -> newest.
 * - Without `after`: the latest 100 messages.
 * - With `after`: messages with createdAt > after - POLL_OVERLAP_MS (capped at
 *   200, oldest first, so a long gap is caught up over successive polls).
 *
 * NOTE: the overlap window means polls re-return messages the client has
 * already seen. That is intended: the UI dedupes by message id.
 */
export async function getMessages(
  conversationId: string,
  after?: string
): Promise<ActionResult<ChatMessage[]>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsedId = uuidSchema.safeParse(conversationId);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  let afterDate: Date | null = null;
  if (after !== undefined) {
    const parsedAfter = afterSchema.safeParse(after);
    if (!parsedAfter.success) return { ok: false, error: "Invalid timestamp" };
    afterDate = new Date(new Date(parsedAfter.data).getTime() - POLL_OVERLAP_MS);
  }

  try {
    const conversation = await getParticipantConversation(
      parsedId.data,
      user.id
    );
    if (!conversation) return { ok: false, error: NOT_FOUND };

    const columns = {
      id: messagesTable.id,
      senderId: messagesTable.senderId,
      body: messagesTable.body,
      createdAt: messagesTable.createdAt,
    };

    let rows;
    if (afterDate) {
      rows = await db
        .select(columns)
        .from(messagesTable)
        .where(
          and(
            eq(messagesTable.conversationId, conversation.id),
            gt(messagesTable.createdAt, afterDate)
          )
        )
        .orderBy(asc(messagesTable.createdAt))
        .limit(POLL_MESSAGES_LIMIT);
    } else {
      const latest = await db
        .select(columns)
        .from(messagesTable)
        .where(eq(messagesTable.conversationId, conversation.id))
        .orderBy(desc(messagesTable.createdAt))
        .limit(INITIAL_MESSAGES_LIMIT);
      rows = latest.reverse();
    }

    return {
      ok: true,
      data: rows.map((row) => ({
        id: row.id,
        senderId: row.senderId,
        body: row.body,
        createdAt: row.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    return { ok: false, error: "Could not load messages" };
  }
}

export async function sendMessage(
  conversationId: string,
  body: string
): Promise<ActionResult<ChatMessage>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsedId = uuidSchema.safeParse(conversationId);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  const parsedBody = bodySchema.safeParse(body);
  if (!parsedBody.success) {
    return {
      ok: false,
      error: parsedBody.error.issues[0]?.message ?? "Invalid message",
    };
  }

  try {
    const conversation = await getParticipantConversation(
      parsedId.data,
      user.id
    );
    if (!conversation) return { ok: false, error: NOT_FOUND };

    // One timestamp for the message, the conversation's lastMessageAt and the
    // sender's last-read marker, written atomically in a single batch
    // (neon-http has no interactive transactions).
    const now = new Date();
    const senderReadColumn =
      conversation.customerId === user.id
        ? { customerLastReadAt: now }
        : { providerLastReadAt: now };

    const [inserted] = await db.batch([
      db
        .insert(messagesTable)
        .values({
          conversationId: conversation.id,
          senderId: user.id,
          body: parsedBody.data,
          createdAt: now,
        })
        .returning({
          id: messagesTable.id,
          senderId: messagesTable.senderId,
          body: messagesTable.body,
          createdAt: messagesTable.createdAt,
        }),
      db
        .update(conversationsTable)
        .set({ lastMessageAt: now, ...senderReadColumn })
        .where(eq(conversationsTable.id, conversation.id)),
    ]);

    const message = inserted[0];
    if (!message) return { ok: false, error: "Could not send message" };

    return {
      ok: true,
      data: {
        id: message.id,
        senderId: message.senderId,
        body: message.body,
        createdAt: message.createdAt.toISOString(),
      },
    };
  } catch (err) {
    console.error("Failed to send message:", err);
    return { ok: false, error: "Could not send message" };
  }
}

export async function markConversationRead(
  conversationId: string
): Promise<ActionResult<null>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: NOT_AUTHENTICATED };

  const parsedId = uuidSchema.safeParse(conversationId);
  if (!parsedId.success) return { ok: false, error: NOT_FOUND };

  try {
    const conversation = await getParticipantConversation(
      parsedId.data,
      user.id
    );
    if (!conversation) return { ok: false, error: NOT_FOUND };

    const now = new Date();
    await db
      .update(conversationsTable)
      .set(
        conversation.customerId === user.id
          ? { customerLastReadAt: now }
          : { providerLastReadAt: now }
      )
      .where(eq(conversationsTable.id, conversation.id));

    return { ok: true, data: null };
  } catch (err) {
    console.error("Failed to mark conversation as read:", err);
    return { ok: false, error: "Could not update conversation" };
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const user = await getCurrentUser();
    if (!user) return 0;

    const [row] = await db
      .select({ total: count() })
      .from(messagesTable)
      .innerJoin(
        conversationsTable,
        eq(messagesTable.conversationId, conversationsTable.id)
      )
      .where(unreadCondition(user.id));

    return row?.total ?? 0;
  } catch (err) {
    console.error("Failed to fetch unread count:", err);
    return 0;
  }
}
