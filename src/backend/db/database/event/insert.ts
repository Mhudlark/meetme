import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { eventsSchema } from '../schemas/events';
import type { EventSchema } from '../schemas/types';

/**
 * Insert a new room into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomName The name of the room
 */
export const insertRoomIntoDB = async (
  supabase: Supabase,
  roomName: string
): Promise<EventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .insert([{ [eventsSchema.room_name]: roomName }])
      .select();

    checkSupabaseErrorResponse(error);

    return data?.[0] as EventSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error adding room');
  }
};
