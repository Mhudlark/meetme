import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import type { UserSchema } from '../schemas/types';
import { usersSchema } from '../schemas/users';

/**
 * Insert a new user into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} username The username of the user
 */
export const insertUserIntoDB = async (
  supabase: Supabase,
  username: string,
  eventId: string
): Promise<UserSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .insert([
        { [usersSchema.username]: username, [usersSchema.event_id]: eventId },
      ])
      .select();

    checkSupabaseErrorResponse(error);

    return data?.[0] as UserSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error adding user');
  }
};
