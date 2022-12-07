import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { meetingsSchema } from '../schemas/meetings';
import type { BaseMeetingSchema, MeetingSchema } from '../schemas/types';

/**
 * Fetch a given meeting from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} meetingId The meeting id
 */
export const selectBaseMeetingFromDB = async (
  supabase: Supabase,
  meetingId: string
): Promise<BaseMeetingSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.meetings.channel)
      .select(`*`)
      .match({ [meetingsSchema.id]: meetingId });

    checkSupabaseErrorResponse(error);

    return getArrElement<BaseMeetingSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error selecting base meeting from DB');
  }
};

/**
 * Fetch a given meeting with all user and preference information
 * @param {Supabase} supabase The Supabase client
 * @param {string} meetingId The meeting id
 */
export const selectMeetingFromDB = async (
  supabase: Supabase,
  meetingId: string
): Promise<MeetingSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.meetings.channel)
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
      .match({ [meetingsSchema.id]: meetingId });

    checkSupabaseErrorResponse(error);

    const meeting = data?.[0];
    return meeting as unknown as MeetingSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error selecting meeting from DB');
  }
};