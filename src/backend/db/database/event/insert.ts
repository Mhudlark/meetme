import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { eventsSchema } from '../schemas/events';
import type { EventSchema } from '../schemas/types';

/**
 * Insert a new event into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventName The event name
 */
export const insertEventIntoDB = async (
  supabase: Supabase,
  eventName: string
): Promise<EventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .insert([{ [eventsSchema.name]: eventName }])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<EventSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error inserting event into DB');
  }
};
