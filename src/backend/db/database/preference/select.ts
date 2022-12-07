import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';

/**
 * Fetch all user preferences for an event
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 */
export const selectPreferenceFromDB = async (
  supabase: Supabase,
  eventId: string
): Promise<PreferenceSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      // .select(`*, author:user_id(*)`)
      .select(`*`)
      .match({ [preferencesSchema.event_id]: eventId })
      .order(preferencesSchema.created_at, { ascending: true });

    checkSupabaseErrorResponse(error);

    return getArrElement<PreferenceSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error selecting preference from DB');
  }
};
