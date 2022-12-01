import type { Room, User } from '@/sharedTypes';

import type { Action } from '../action';

export const RESET_ROOM = 'RESET_ROOM';
export const SET_ROOM = 'SET_ROOM';

export const SET_ROOM_NAME = 'SET_ROOM_NAME';

export const ADD_USER_TO_ROOM = 'ADD_USER_TO_ROOM';
export const ADD_USERS_TO_ROOM = 'ADD_USERS_TO_ROOM';
export const REMOVE_USER_FROM_ROOM = 'REMOVE_USER_FROM_ROOM';

type ResetRoom = () => Action<null>;

export const resetRoom: ResetRoom = () => ({
  type: RESET_ROOM,
  payload: null,
});

type SetRoom = (room: Room) => Action<Room>;

export const setRoom: SetRoom = (room: Room) => ({
  type: SET_ROOM,
  payload: room,
});

type SetRoomName = (roomName: string) => Action<string>;

export const setRoomName: SetRoomName = (roomName) => ({
  type: SET_ROOM_NAME,
  payload: roomName,
});

type AddUserToRoom = (user: User) => Action<User>;

export const addUserToRoom: AddUserToRoom = (user) => ({
  type: ADD_USER_TO_ROOM,
  payload: user,
});

type AddUsersToRoom = (users: User[]) => Action<User[]>;

export const addUsersToRoom: AddUsersToRoom = (users) => ({
  type: ADD_USERS_TO_ROOM,
  payload: users,
});

type RemoveUserFromRoom = (userId: string) => Action<string>;

export const removeUserFromRoom: RemoveUserFromRoom = (userId) => ({
  type: REMOVE_USER_FROM_ROOM,
  payload: userId,
});

// ====================== Thunk Actions =========================
