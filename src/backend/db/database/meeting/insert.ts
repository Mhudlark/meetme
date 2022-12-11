import type { MeetingDetails } from '@/types/meeting';
import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { meetingsSchema } from '../schemas/meetings';
import type { BaseMeetingSchema } from '../schemas/types';

/**
 * Insert a new meeting into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {MeetingDetails} meetingDetails The details of the meeting to insert
 */
export const insertMeetingIntoDB = async (
  supabase: Supabase,
  meetingDetails: MeetingDetails
): Promise<BaseMeetingSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.meetings.channel)
      .insert([
        {
          [meetingsSchema.name]: meetingDetails.name,
          [meetingsSchema.description]: meetingDetails.description,
          [meetingsSchema.start_date]: meetingDetails.startDate,
          [meetingsSchema.end_date]: meetingDetails.endDate,
          [meetingsSchema.min_time]: meetingDetails.minTime,
          [meetingsSchema.max_time]: meetingDetails.maxTime,
        },
      ])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<BaseMeetingSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error inserting meeting into DB');
  }
};
