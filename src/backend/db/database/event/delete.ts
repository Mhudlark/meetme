import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { eventsSchema } from '../schemas/events';

/**
 * Delete a room from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const deleteRoomFromDB = async (supabase: Supabase, roomId: string) => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .delete()
      .match({ [eventsSchema.room_id]: roomId });

    checkSupabaseErrorResponse(error);

    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting room');
  }
};
