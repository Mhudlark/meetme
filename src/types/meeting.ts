import { isAfter } from 'date-fns';

import type {
  BaseMeetingSchema,
  MeetingSchema,
} from '@/backend/db/database/schemas/types';

import type { Preference } from './preference';
import { createPreferenceFromPreferenceSchema } from './preference';
import type { User } from './user';
import { createUserFromUserSchema } from './user';

export const INTERVAL_SIZE = 1;

export class Meeting {
  constructor(
    public id: string,
    public details: MeetingDetails,
    public users: User[],
    public preferences: Preference[]
  ) {}
}

export const createMeetingFromMeetingSchema = (
  schema: MeetingSchema
): Meeting => {
  const meetingDetails = {
    name: schema.name,
    description: schema.description,
    startDate: new Date(schema.start_date),
    endDate: new Date(schema.end_date),
    minTime: Number(schema.min_time),
    maxTime: Number(schema.max_time),
  };

  const users = schema.Users.map((schemaUser) =>
    createUserFromUserSchema(schemaUser)
  );

  const preferences = schema.Preferences.map((schemaPreference) =>
    createPreferenceFromPreferenceSchema(schemaPreference)
  );
  return new Meeting(schema.id, meetingDetails, users, preferences);
};

export const createMeetingFromBaseMeetingSchema = (
  schema: BaseMeetingSchema
): Meeting => {
  const meetingDetails = {
    name: schema.name,
    description: schema.description,
    startDate: new Date(schema.start_date),
    endDate: new Date(schema.end_date),
    minTime: Number(schema.min_time),
    maxTime: Number(schema.max_time),
  };

  return new Meeting(schema.id, meetingDetails, [], []);
};

export type MeetingDetails = {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  minTime: number;
  maxTime: number;
};

export const isMeetingHost = (meeting: Meeting | null, user: User | null) => {
  if (!meeting) return false;
  if (!user) return false;

  const host = meeting.users.sort((a, b) =>
    isAfter(a.joinedAt, b.joinedAt) ? 1 : -1
  )[0];

  return host?.userId === user.userId;
};
