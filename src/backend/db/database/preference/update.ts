import type { SchedulorSelection } from '@/components/Schedulor/DateSlider';
import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';

/**
 * Update a user's preferences / selections in the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventId The event id
 * @param {string} userId The user id
 * @param {SchedulorSelection} selections The user preferences / selections
 */
export const updatePreferenceInDB = async (
  supabase: Supabase,
  eventId: string,
  userId: string,
  selections: SchedulorSelection
): Promise<PreferenceSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .update({ [preferencesSchema.selections]: selections })
      .match({
        [preferencesSchema.event_id]: eventId,
        [preferencesSchema.user_id]: userId,
      })
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<PreferenceSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error updating preference in DB');
  }
};
