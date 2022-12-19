import type { PreferenceSchema } from '@/backend/db/database/schemas/types';
import { parseSelectionsString } from '@/utils/types/parse';

import type { PreferenceSelection } from './preferenceSelection';

export class Preference {
  constructor(
    public preferenceId: string,
    public meetingId: string,
    public userId: string,
    public scheduleSelections: PreferenceSelection[]
  ) {}

  public toString(): string {
    return JSON.stringify(this.scheduleSelections);
  }

  public copyWithNewSelections(selections: PreferenceSelection[]): Preference {
    return new Preference(
      this.preferenceId,
      this.meetingId,
      this.userId,
      selections
    );
  }
}

export const createPreferenceFromPreferenceSchema = (
  schema: PreferenceSchema
): Preference => {
  const selections = parseSelectionsString(schema.selections);

  return new Preference(
    schema.id,
    schema.meeting_id,
    schema.user_id,
    selections
  );
};
