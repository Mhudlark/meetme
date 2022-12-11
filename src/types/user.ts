import type { UserSchema } from '@/backend/db/database/schemas/types';

export class User {
  constructor(
    public userId: string,
    public username: string,
    public joinedAt: Date
  ) {}
}

export const createUserFromUserSchema = (schema: UserSchema): User => {
  const joinedAt = new Date(schema.created_at);

  return new User(schema.id, schema.username, joinedAt);
};

export const getUserFromId = (users: User[], id: string): User => {
  const foundUser = users.find((user) => user.userId === id);

  if (!foundUser) throw new Error(`User with id ${id} not found`);

  return foundUser;
};
