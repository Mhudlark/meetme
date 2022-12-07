import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { eventsSchema } from '../schemas/events';
import type { BaseEventSchema, EventSchema } from '../schemas/types';

/**
 * Fetch an event with the given eventId
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const selectBaseEventFromDB = async (
  supabase: Supabase,
  eventId: string
): Promise<BaseEventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .select(`*`)
      .match({ [eventsSchema.id]: eventId });

    checkSupabaseErrorResponse(error);

    return getArrElement<BaseEventSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error selecting base event from DB');
  }
};

/**
 * Fetch a given event with all user and preference information
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const selectEventFromDB = async (
  supabase: Supabase,
  eventId: string
): Promise<EventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .select(
        `
      *,
      ${dbConfig.channels.users.table} (
        *
      ),
      ${dbConfig.channels.preferences.table} (
        *
      )
    `
      )
      .match({ [eventsSchema.id]: eventId });

    checkSupabaseErrorResponse(error);

    const event = data?.[0];
    return event as unknown as EventSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error selecting event from DB');
  }
};
