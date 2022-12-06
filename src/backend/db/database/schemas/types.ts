export interface PreferenceSchema {
  id: string;
  created_at: string;
  event_id: string;
  user_id: string;
  selections: string;
}

export interface UserSchema {
  id: string;
  created_at: string;
  username: string;
  event_id: string;
}

export interface BaseEventSchema {
  id: string;
  created_at: string;
  name: string;
}

export interface EventSchema extends BaseEventSchema {
  users: UserSchema[];
  preferences: PreferenceSchema[];
}
