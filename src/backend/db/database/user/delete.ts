import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { usersSchema } from '../schemas/users';

/**
 * Delete a user from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} userId The user id
 */
export const deleteUserFromDB = async (supabase: Supabase, userId: string) => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .delete()
      .match({ [usersSchema.user_id]: userId });

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting user');
  }
};
