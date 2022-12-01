import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { messagesSchema } from '../schemas/messages';
import type { MessageSchema } from '../schemas/types';

/**
 * Fetch all messages and their authors for a given room
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const selectMessagesFromDB = async (
  supabase: Supabase,
  roomId: string
): Promise<MessageSchema[]> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.messages.channel)
      // .select(`*, author:user_id(*)`)
      .select(`*`)
      .eq(messagesSchema.room_id, roomId)
      .order(messagesSchema.created_at, { ascending: true });

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    return data as MessageSchema[];
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching messages');
  }
};
