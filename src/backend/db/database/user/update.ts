import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import type { UserSchema } from '../schemas/types';
import { usersSchema } from '../schemas/users';

/**
 * Update a user with a room id in the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} userId The user id
 * @param {string} roomId The room id
 */
export const updateUserRoomIdInDB = async (
  supabase: Supabase,
  userId: string,
  roomId: string
): Promise<UserSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.users.channel)
      .update({ [usersSchema.room_id]: roomId })
      .match({ [usersSchema.user_id]: userId })
      .select();

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    return data?.[0] as UserSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error adding user to room');
  }
};
