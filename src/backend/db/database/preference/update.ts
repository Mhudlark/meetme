import type { SchedulorSelection } from '@/components/Schedulor/DateSlider';
import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';

/**
 * Update a user's preference in the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} meetingId The meeting id
 * @param {string} userId The user id
 * @param {SchedulorSelection} selections The user preferences / selections
 */
export const updatePreferenceInDB = async (
  supabase: Supabase,
  meetingId: string,
  userId: string,
  selections: SchedulorSelection
): Promise<PreferenceSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .update({ [preferencesSchema.selections]: selections })
      .match({
        [preferencesSchema.meeting_id]: meetingId,
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
