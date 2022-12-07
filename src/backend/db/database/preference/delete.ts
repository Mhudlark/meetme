import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';

/**
 * Delete preferences / selections for a given user from a given event from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 * @param {string} userId The user id
 */
export const deletePreferencesFromDB = async (
  supabase: Supabase,
  eventId: string,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .delete()
      .match({
        [preferencesSchema.event_id]: eventId,
        [preferencesSchema.user_id]: userId,
      });

    checkSupabaseErrorResponse(error);

    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting message');
  }
};

/**
 * Delete all preferences / selections for a given event from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const deletePreferencesForEventFromDB = async (
  supabase: Supabase,
  eventId: string
) => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .delete()
      .match({ [preferencesSchema.event_id]: eventId });

    checkSupabaseErrorResponse(error);

    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting message');
  }
};
