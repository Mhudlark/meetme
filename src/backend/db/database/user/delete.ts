import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import type { UserSchema } from '../schemas/types';
import { usersSchema } from '../schemas/users';

/**
 * Delete a user from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} userId The user id
 */
export const deleteUserFromDB = async (
  supabase: Supabase,
  userId: string
): Promise<UserSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .delete()
      .match({ [usersSchema.id]: userId })
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<UserSchema>(data);
  } catch (error) {
    throw new Error(`Error deleting user from DB: ${error}`);
  }
};
