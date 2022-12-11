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

/**
 * Delete all users for a given meeting from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} meetingId The meeting id
 */
export const deleteAllUsersForMeetingFromDB = async (
  supabase: Supabase,
  meetingId: string
): Promise<UserSchema[]> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .delete()
      .match({ [usersSchema.meeting_id]: meetingId })
      .select();

    checkSupabaseErrorResponse(error);

    return data as UserSchema[];
  } catch (error) {
    throw new Error(`Error deleting all users for meeting from DB: ${error}`);
  }
};
