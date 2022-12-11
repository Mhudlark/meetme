import { getArrElement } from '@/utils/array';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { checkSupabaseErrorResponse } from '../error';
import { meetingsSchema } from '../schemas/meetings';
import type { BaseMeetingSchema } from '../schemas/types';

/**
 * Delete a meeting from the DB
 * @param {Supabase} supabase The Supabase client
 * @param {string} meetingId The meeting id
 */
export const deleteMeetingFromDB = async (
  supabase: Supabase,
  meetingId: string
): Promise<BaseMeetingSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.meetings.channel)
      .delete()
      .match({ [meetingsSchema.id]: meetingId })
      .select();

    checkSupabaseErrorResponse(error);

    return getArrElement<BaseMeetingSchema>(data);
  } catch (error) {
    throw new Error(`Error deleting meeting from DB: ${error}`);
  }
};
