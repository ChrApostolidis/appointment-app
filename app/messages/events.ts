// Window events that let any component talk to the messages panel in the Header
// without prop-drilling through every page.

export const OPEN_MESSAGES_EVENT = "open-messages";
export const UNREAD_MESSAGES_CHANGED_EVENT = "unread-messages-changed";

export type OpenMessagesDetail = { conversationId?: string };

export function openMessagesPanel(conversationId?: string) {
  window.dispatchEvent(
    new CustomEvent<OpenMessagesDetail>(OPEN_MESSAGES_EVENT, {
      detail: { conversationId },
    })
  );
}

export function notifyUnreadMessagesChanged() {
  window.dispatchEvent(new Event(UNREAD_MESSAGES_CHANGED_EVENT));
}
