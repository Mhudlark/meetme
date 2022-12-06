import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';

/**
 * Fetch all messages and their authors for a given room
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const selectMessagesFromDB = async (
  supabase: Supabase,
  roomId: string
): Promise<PreferenceSchema[]> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.preferences.channel)
      // .select(`*, author:user_id(*)`)
      .select(`*`)
      .eq(preferencesSchema.room_id, roomId)
      .order(preferencesSchema.created_at, { ascending: true });

    checkSupabaseErrorResponse(error);

    return data as PreferenceSchema[];
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching messages');
  }
};
