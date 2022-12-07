import type { SchedulorSelection } from '@/components/Schedulor/DateSlider';
import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';

/**
 * Insert a new user preference / selection into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} selections The user preferences / selections
 * @param {string} meetingId The meeting id
 * @param {string} userId The user id
 */
export const insertPreferenceIntoDB = async (
  supabase: Supabase,
  selections: SchedulorSelection,
  meetingId: string,
  userId: string
): Promise<PreferenceSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .insert([
        {
          [preferencesSchema.meeting_id]: meetingId,
          [preferencesSchema.user_id]: userId,
          [preferencesSchema.selections]: selections,
        },
      ])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<PreferenceSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error inserting preference into DB');
  }
};
