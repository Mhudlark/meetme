import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { meetingsSchema } from '../schemas/meetings';
import type { MeetingSchema } from '../schemas/types';

/**
 * Insert a new meeting into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} meetingName The meeting name
 */
export const insertMeetingIntoDB = async (
  supabase: Supabase,
  meetingName: string
): Promise<MeetingSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.meetings.channel)
      .insert([{ [meetingsSchema.name]: meetingName }])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<MeetingSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error inserting meeting into DB');
  }
};
