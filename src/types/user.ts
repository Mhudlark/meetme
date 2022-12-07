import type { UserSchema } from '@/backend/db/database/schemas/types';

export class User {
  constructor(public userId: string, public username: string) {}
}

export const createUserFromUserSchema = (schema: UserSchema): User => {
  return new User(schema.id, schema.username);
};
