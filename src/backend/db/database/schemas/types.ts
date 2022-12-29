export interface PreferenceSchema {
  id: string;
  created_at: Date;
  meeting_id: string;
  user_id: string;
  selections: string;
}

export interface UserSchema {
  id: string;
  created_at: Date;
  username: string;
  meeting_id: string;
}

export interface BaseMeetingSchema {
  id: string;
  created_at: Date;
  code: string;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  min_time: string;
  max_time: string;
  interval_size: number;
}

export interface MeetingSchema extends BaseMeetingSchema {
  Users: UserSchema[];
  Preferences: PreferenceSchema[];
}
