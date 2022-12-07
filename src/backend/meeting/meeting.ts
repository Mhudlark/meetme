import { Meeting } from '@/types/meeting';

import { insertMeetingIntoDB } from '../db/database/meeting/insert';
import type { Supabase } from '../db/types';

/**
 * Insert a new room into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} eventName The event name
 */
export const createMeeting = async (
  supabase: Supabase,
  eventName: string
): Promise<Meeting> => {
  const meetingInfo = await insertMeetingIntoDB(supabase, eventName);

  return new Meeting(meetingInfo.id, meetingInfo.name, [], []);
};
