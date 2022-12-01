import type { ChatMessage, Room, User } from '@/sharedTypes';

export type InitRoom = (
  roomId: string,
  roomName: string,
  users?: User[],
  chatMessages?: ChatMessage[]
) => Room;

export const initRoom: InitRoom = (
  roomId,
  roomName,
  users = [],
  chatMessages = []
) => ({
  roomId,
  roomName,
  users,
  chatMessages,
});
