import type { User } from '@/types/user';

export const getUsersFromUserIds = (userIds: string[], users: User[]) => {
  return users.filter((user) => userIds.includes(user.userId));
};
