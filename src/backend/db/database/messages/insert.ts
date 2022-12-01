import type { Supabase } from '../../types';
import type { MessageSchema } from '../schemas/types';

/**
 * Insert a new message into the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} message The message text
 * @param {string} roomId The room id
 * @param {string} userId The user id
 */
export const insertMessageIntoDB = async (
  supabase: Supabase,
  message: string,
  roomId: string,
  userId: string
): Promise<MessageSchema> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ room_id: roomId, message, author: userId }])
      .select();

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    return data?.[0] as MessageSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error adding message');
  }
};
