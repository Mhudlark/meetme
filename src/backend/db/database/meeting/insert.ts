import type { MeetingDetails } from '@/types/meeting';
import { getArrElement } from '@/utils/array';
import { INTERVAL_SIZE } from '@/utils/constants';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import type { BaseMeetingSchema } from '../schemas/types';

export type InsertMeetingSchema = Omit<BaseMeetingSchema, 'id' | 'created_at'>;

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
    const meetingInsert: InsertMeetingSchema = {
      code: meetingDetails.code,
      name: meetingDetails.name,
      description: meetingDetails.description,
      start_date: meetingDetails.startDate,
      end_date: meetingDetails.endDate,
      min_time: meetingDetails.minTime.toString(),
      max_time: meetingDetails.maxTime.toString(),
      interval_size: INTERVAL_SIZE,
    };

    const { data, error } = await supabase
      .from(dbConfig.channels.meetings.channel)
      .insert([meetingInsert])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<BaseMeetingSchema>(data);
  } catch (error) {
    throw new Error(`Error inserting meeting into DB: ${error}`);
  }
};
