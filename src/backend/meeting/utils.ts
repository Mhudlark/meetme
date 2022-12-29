import type {
  Meeting,
  MeetingDetails,
  PartialMeetingDetails,
} from '@/types/meeting';
import {
  createMeetingFromBaseMeetingSchema,
  createMeetingFromMeetingSchema,
} from '@/types/meeting';
import { generateUniqueMeetingCode } from '@/utils/meetingCode';

import { insertMeetingIntoDB } from '../db/database/meeting/insert';
import {
  selectMeetingCodesFromDB,
  selectMeetingFromDB,
  selectMeetingFromDBByCode,
} from '../db/database/meeting/select';
import type { Supabase } from '../db/types';

export const getMeetingCode = async (supabase: Supabase): Promise<string> => {
  const meetingCodesInfos = await selectMeetingCodesFromDB(supabase);

  const meetingCodes = meetingCodesInfos.map((meeting) => meeting.code);

  const meetingCode = generateUniqueMeetingCode(meetingCodes);

  return meetingCode;
};

export const createMeeting = async (
  supabase: Supabase,
  meetingDetails: PartialMeetingDetails
): Promise<Meeting> => {
  const meetingCode = await getMeetingCode(supabase);

  const fullMeetingDetails: MeetingDetails = {
    code: meetingCode,
    ...meetingDetails,
  };

  const baseMeetingInfo = await insertMeetingIntoDB(
    supabase,
    fullMeetingDetails
  );

  return createMeetingFromBaseMeetingSchema(baseMeetingInfo);
};

export const getMeeting = async (
  supabase: Supabase,
  meetingId: string
): Promise<Meeting> => {
  const meetingInfo = await selectMeetingFromDB(supabase, meetingId);

  return createMeetingFromMeetingSchema(meetingInfo);
};

export const joinMeeting = async (
  supabase: Supabase,
  meetingCode: string
): Promise<Meeting> => {
  const meetingInfo = await selectMeetingFromDBByCode(supabase, meetingCode);

  return createMeetingFromMeetingSchema(meetingInfo);
};

const meetingUtils = {
  createMeeting,
  getMeeting,
  joinMeeting,
};

export default meetingUtils;
