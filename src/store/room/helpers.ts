import type { Room } from '@/sharedTypes';

export const roomReducerInitialState: Room = {
  roomId: '',
  roomName: '',
  users: [],
  chatMessages: [],
};
