export interface MessageSchema {
  message_id: string;
  created_at: string;
  room_id: string;
  message: string;
  author: string;
}

export interface UserSchema {
  user_id: string;
  created_at: string;
  username: string;
  room_id: string;
}

export interface BaseRoomSchema {
  room_id: string;
  created_at: string;
  room_name: string;
}

export interface RoomSchema extends BaseRoomSchema {
  users: UserSchema[];
  messages: MessageSchema[];
}
