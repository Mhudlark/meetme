import type {
  BaseMeetingSchema,
  MeetingSchema,
} from '@/backend/db/database/schemas/types';

import type { Preference } from './preference';
import { createPreferenceFromPreferenceSchema } from './preference';
import type { User } from './user';
import { createUserFromUserSchema } from './user';

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
