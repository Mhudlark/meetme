import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { roomsSchema } from '../schemas/rooms';
import type { RoomSchema } from '../schemas/types';

/**
 * Insert a new room into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomName The name of the room
 */
export const insertRoomIntoDB = async (
  supabase: Supabase,
  roomName: string
): Promise<RoomSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.rooms.channel)
      .insert([{ [roomsSchema.room_name]: roomName }])
      .select();

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    return data?.[0] as RoomSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error adding room');
  }
};
