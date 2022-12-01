import type { ChatMessage, User } from '@/sharedTypes';

export type InitChatMessage = (
  messageId: string,
  message: string,
  author: User
) => ChatMessage;

export const initChatMessage: InitChatMessage = (
  messageId,
  message,
  author
) => ({
  messageId,
  message,
  author,
});

export type InitChatMessageFromAuthorId = (
  messageId: string,
  message: string,
  authorId: string,
  users: User[]
) => ChatMessage;

export const initChatMessageFromAuthorId: InitChatMessageFromAuthorId = (
  messageId,
  message,
  authorId,
  users
) => {
  const author = users.find((user) => user.userId === authorId);

  if (!author) throw new Error(`User with authorId '${authorId}' not found`);

  return initChatMessage(messageId, message, author);
};
