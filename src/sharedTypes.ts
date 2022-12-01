export type AnyFunction = (...args: any[]) => void;

export interface User {
  userId: string;
  username: string;
}

export interface Room {
  roomId: string;
  roomName: string;
  users: User[];
  chatMessages: ChatMessage[];
}

export interface ChatMessage {
  messageId: string;
  message: string;
  author: User;
}
