import type { Room } from '@/sharedTypes';

import { mockRoom1, mockRoom2, mockRoom3 } from './room';

export const rooms: Room[] = [mockRoom1, mockRoom2, mockRoom3];

export const getMockRooms = async () => [...rooms];

export const getMockRoom = async (roomName: string): Promise<Room> => {
  const room = [...rooms].find((roomObj) => roomObj.roomName === roomName);
  if (!room) throw new Error(`Room ${roomName} doesn't exist`);
  return { ...room };
};
