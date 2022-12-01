import type { Action } from '../action';

export const SET_USERNAME = 'SET_USERNAME';
export const SET_USER_ID = 'SET_USER_ID';

export type CreateUser = (username: string) => Action<string>;

export const createUser: CreateUser = (username) => ({
  type: SET_USERNAME,
  payload: username,
});

export type SetUsername = (username: string) => Action<string>;

export const setUsername: SetUsername = (username) => ({
  type: SET_USERNAME,
  payload: username,
});

export type SetUserId = (userId: string) => Action<string>;

export const setUserId: SetUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});
