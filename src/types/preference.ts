import type { PreferenceSchema } from '@/backend/db/database/schemas/types';
import type { SchedulorSelection } from '@/sharedTypes';

export class Preference {
  constructor(
    public preferenceId: string,
    public meetingId: string,
    public userId: string,
    public scheduleSelections: SchedulorSelection[]
  ) {}

  public toString(): string {
    return JSON.stringify(this.scheduleSelections);
  }
}

export const parseSelection = (selection: {
  startDate: string;
  endDate: string;
}): SchedulorSelection => {
  return {
    startDate: new Date(selection.startDate),
    endDate: new Date(selection.endDate),
  };
};

export const parseSelectionsString = (
  selections: string
): SchedulorSelection[] => {
  return JSON.parse(selections).map(parseSelection);
};

export const createPreferenceFromPreferenceSchema = (
  schema: PreferenceSchema
): Preference => {
  return new Preference(
    schema.id,
    schema.meeting_id,
    schema.user_id,
    parseSelectionsString(schema.selections)
  );
};
