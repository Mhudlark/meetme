import type { MeetingSchema } from '@/backend/db/database/schemas/types';

import type { Preference } from './preference';
import { createPreferenceFromPreferenceSchema } from './preference';
import type { User } from './user';
import { createUserFromUserSchema } from './user';

export class Meeting {
  constructor(
    public id: string,
    public name: string,
    public users: User[],
    public preferences: Preference[]
  ) {}
}

export const createMeetingFromMeetingSchema = (
  schema: MeetingSchema
): Meeting => {
  const users = schema.users.map((schemaUser) =>
    createUserFromUserSchema(schemaUser)
  );
  const preferences = schema.preferences.map((schemaPreference) =>
    createPreferenceFromPreferenceSchema(schemaPreference)
  );
  return new Meeting(schema.id, schema.name, users, preferences);
};