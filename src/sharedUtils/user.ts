import type { User } from '@/sharedTypes';

export type InitUser = (userId: string, username: string) => User;

export const initUser: InitUser = (userId, username) => ({
  userId,
  username,
});
