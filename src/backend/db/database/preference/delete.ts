import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';

/**
 * Delete preference / selections for a given user from a given event from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 * @param {string} userId The user id
 */
export const deletePreferenceFromDB = async (
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
      })
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<PreferenceSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting preference from DB');
  }
};

/**
 * Delete all preference / selections for a given event from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const deleteAllPreferencesForEventFromDB = async (
  supabase: Supabase,
  eventId: string
): Promise<PreferenceSchema[]> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .delete()
      .match({ [preferencesSchema.event_id]: eventId })
      .select();

    checkSupabaseErrorResponse(error);

    return data as PreferenceSchema[];
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting all preferences for event from DB');
  }
};
