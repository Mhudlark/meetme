import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { messagesSchema } from '../schemas/messages';

/**
 * Delete all messages for a given room from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const deleteMessagesForRoomFromDB = async (
  supabase: Supabase,
  roomId: string
) => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.messages.channel)
      .delete()
      .match({ [messagesSchema.room_id]: roomId });

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error deleting message');
  }
};
