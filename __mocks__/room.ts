import type { Room } from '@/sharedTypes';

import {
  mockUser1,
  mockUser2,
  mockUser3,
  mockUser4,
  mockUser5,
  mockUser6,
} from './user';

export const mockRoom: Room = {
  roomId: '0123',
  roomName: 'mock-room',
  users: [mockUser1, mockUser2, mockUser3],
  chatMessages: [],
};

export const mockEmptyRoom: Room = {
  roomId: '0000',
  roomName: 'mock-room',
  users: [],
  chatMessages: [],
};

export const mockRoom1: Room = {
  roomId: '1234',
  roomName: 'mock-room-1',
  users: [mockUser1, mockUser2, mockUser3],
  chatMessages: [],
};

export const mockRoom2: Room = {
  roomId: '2345',
  roomName: 'mock-room-2',
  users: [mockUser4, mockUser5],
  chatMessages: [],
};

export const mockRoom3: Room = {
  roomId: '3456',
  roomName: 'mock-room-3',
  users: [mockUser6],
  chatMessages: [],
};

export const getMockRoom = async () => ({ ...mockRoom });

export const getMockEmptyRoom = async () => ({ ...mockEmptyRoom });
