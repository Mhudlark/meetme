export interface PreferenceSchema {
  id: string;
  created_at: string;
  meeting_id: string;
  user_id: string;
  selections: string;
}

export interface UserSchema {
  id: string;
  created_at: string;
  username: string;
  meeting_id: string;
}

export interface BaseMeetingSchema {
  id: string;
  created_at: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  min_time: string;
  max_time: string;
}

export interface MeetingSchema extends BaseMeetingSchema {
  Users: UserSchema[];
  Preferences: PreferenceSchema[];
}
