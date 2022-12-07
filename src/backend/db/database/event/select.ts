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

    const room = data?.[0];
    return room as BaseEventSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching users');
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

    const room = data?.[0];
    return room as unknown as EventSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching users');
  }
};
