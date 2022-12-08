import type { PreferenceSchema } from '@/backend/db/database/schemas/types';
import type { SchedulorSelection } from '@/sharedTypes';

export class Preference {
  constructor(
    public preferenceId: string,
    public scheduleSelections: SchedulorSelection[]
  ) {}

  public toString(): string {
    return JSON.stringify(this.scheduleSelections);
  }
}

export const parseSelectionsString = (
  selections: string
): SchedulorSelection[] => {
  return JSON.parse(selections);
};

export const createPreferenceFromPreferenceSchema = (
  schema: PreferenceSchema
): Preference => {
  return new Preference(schema.id, parseSelectionsString(schema.selections));
};
