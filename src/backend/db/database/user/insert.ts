import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import type { UserSchema } from '../schemas/types';

export type InsertUserSchema = Omit<UserSchema, 'id' | 'created_at'>;

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
    const userInsert: InsertUserSchema = {
      username,
      meeting_id: meetingId,
    };

    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .insert([userInsert])
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<UserSchema>(data);
  } catch (error) {
    throw new Error(`Error inserting user into DB: ${error}`);
  }
};
