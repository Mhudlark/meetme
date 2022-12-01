import type { Room, User } from '@/sharedTypes';
import { initRoom } from '@/sharedUtils/room';

import { insertRoomIntoDB } from '../db/database/room/insert';
import { updateUserRoomIdInDB } from '../db/database/user/update';
import type { Supabase } from '../db/types';
import { generateRoomName } from './util';

/**
 * Insert a new room into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {User} user The user who created the room
 */
export const createRoom = async (
  supabase: Supabase,
  user: User
): Promise<Room> => {
  const roomName = generateRoomName();

  const roomInfo = await insertRoomIntoDB(supabase, roomName);

  const userInfo = await updateUserRoomIdInDB(
    supabase,
    user.userId,
    roomInfo.room_id
  );

  if (roomInfo.room_id !== userInfo.room_id)
    throw new Error('Room ID mismatch');

  return initRoom(roomInfo.room_id, roomInfo.room_name);
};
