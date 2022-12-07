import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { eventsSchema } from '../schemas/events';
import type { BaseEventSchema } from '../schemas/types';

/**
 * Delete an event from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const deleteEventFromDB = async (
  supabase: Supabase,
  eventId: string
): Promise<BaseEventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .delete()
      .match({ [eventsSchema.id]: eventId })
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<BaseEventSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting event from DB');
  }
};
