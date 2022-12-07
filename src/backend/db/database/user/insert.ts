import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import type { UserSchema } from '../schemas/types';
import { usersSchema } from '../schemas/users';

/**
 * Insert a new user into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} username The username of the user
 * @param {string} meetingId The meeting id
 */
export const insertUserIntoDB = async (
  supabase: Supabase,
  username: string,
  meetingId: string
): Promise<UserSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .insert([
        {
          [usersSchema.username]: username,
          [usersSchema.meeting_id]: meetingId,
        },
      ])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<UserSchema>(data);
  } catch (error) {
    console.log('error', error);
    throw new Error('Error inserting user into DB');
  }
};
