import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { eventsSchema } from '../schemas/events';

/**
 * Delete an event from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const deleteEventFromDB = async (
  supabase: Supabase,
  eventId: string
) => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .delete()
      .match({ [eventsSchema.id]: eventId });

    checkSupabaseErrorResponse(error);

    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting room');
  }
};
