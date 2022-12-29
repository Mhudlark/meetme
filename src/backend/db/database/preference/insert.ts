import type { PreferenceSelection } from '@/types/preferenceSelection';
import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import type { PreferenceSchema } from '../schemas/types';

export type InsertPreferenceSchema = Omit<
  PreferenceSchema,
  'id' | 'created_at'
>;

/**
 * Insert a new user preference / selection into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} selections The user preferences / selections
 * @param {string} meetingId The meeting id
 * @param {string} userId The user id
 */
export const insertPreferenceIntoDB = async (
  supabase: Supabase,
  meetingId: string,
  userId: string,
  selections: PreferenceSelection[]
): Promise<PreferenceSchema> => {
  try {
    const preferenceInsert: InsertPreferenceSchema = {
      meeting_id: meetingId,
      user_id: userId,
      selections: JSON.stringify(selections),
    };

    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      .insert([preferenceInsert])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<PreferenceSchema>(data);
  } catch (error) {
    throw new Error(`Error inserting preference into DB: ${error}`);
  }
};
