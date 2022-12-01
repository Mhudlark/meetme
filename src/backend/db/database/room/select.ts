import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { roomsSchema } from '../schemas/rooms';
import type { BaseRoomSchema, RoomSchema } from '../schemas/types';

/**
 * Fetch a room with the given roomId
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const selectBaseRoomFromDB = async (
  supabase: Supabase,
  roomId: string
): Promise<BaseRoomSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.rooms.channel)
      .select(`*`)
      .eq(roomsSchema.room_id, roomId);

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    const room = data?.[0];
    return room as BaseRoomSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching users');
  }
};

/**
 * Fetch a given room
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const selectRoomFromDB = async (
  supabase: Supabase,
  roomId: string
): Promise<RoomSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.rooms.channel)
      .select(
        `
      *,
      ${dbConfig.channels.users.table} (
        *
      ),
      ${dbConfig.channels.messages.table} (
        *
      )
    `
      )
      .eq(roomsSchema.room_id, roomId);

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    const room = data?.[0];
    return room as unknown as RoomSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching users');
  }
};
