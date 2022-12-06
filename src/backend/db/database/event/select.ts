import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { eventsSchema } from '../schemas/events';
import type { BaseEventSchema, EventSchema } from '../schemas/types';

/**
 * Fetch a room with the given roomId
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const selectBaseRoomFromDB = async (
  supabase: Supabase,
  roomId: string
): Promise<BaseEventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .select(`*`)
      .eq(eventsSchema.room_id, roomId);

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    const room = data?.[0];
    return room as BaseEventSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching users');
  }
};

/**
 * Fetch a given room
 * @param {Supabase} supabase The Supabase client
 * @param {string} roomId The room id
 */
export const selectRoomFromDB = async (
  supabase: Supabase,
  roomId: string
): Promise<EventSchema> => {
  try {
    const { data, error } = await supabase
      .from(dbConfig.channels.events.channel)
      .select(
        `
      *,
      ${dbConfig.channels.users.table} (
        *
      ),
      ${dbConfig.channels.preferences.table} (
        *
      )
    `
      )
      .eq(eventsSchema.room_id, roomId);

    if (error)
      throw new Error(
        `${error.message} ============= ${error.hint} ============= ${error.details}`
      );

    const room = data?.[0];
    return room as unknown as EventSchema;
  } catch (error) {
    console.log('error', error);
    throw new Error('Error fetching users');
  }
};
