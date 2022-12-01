import type { RealtimeChannel } from '@supabase/realtime-js';
import { useEffect, useRef, useState } from 'react';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import type { UserSchema } from '../schemas/types';
import { usersSchema } from '../schemas/users';
import { PostGresEventType } from '../types';

export type OnUpdate = (newUser: UserSchema) => void;
export type OnDelete = (deletedUserId: string) => void;

export const useRoomListener = (
  supabase: Supabase,
  isInRoom: boolean,
  roomId?: string,
  onUpdate?: OnUpdate,
  onDelete?: OnDelete
) => {
  const savedOnUpdate = useRef<OnUpdate>();
  const savedOnDelete = useRef<OnDelete>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render.
  useEffect(() => {
    savedOnUpdate.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    savedOnDelete.current = onDelete;
  }, [onDelete]);

  const [usersChannel, setUsersChannel] = useState<RealtimeChannel | null>(
    null
  );

  useEffect(() => {
    if (isInRoom && roomId) {
      const usersConfig = dbConfig.channels.users;

      const channel = supabase
        .channel(usersConfig.channel)
        .on(
          'postgres_changes',
          {
            event: PostGresEventType.UPDATE,
            schema: usersConfig.schema,
            table: usersConfig.table,
            filter: `${usersSchema.room_id}=eq.${roomId}`,
          },
          (payload) => savedOnUpdate.current?.(payload.new as UserSchema)
        )
        .on(
          'postgres_changes',
          {
            event: PostGresEventType.DELETE,
            schema: usersConfig.schema,
            table: usersConfig.table,
            filter: `${usersSchema.room_id}=eq.${roomId}`,
          },
          (payload) => savedOnDelete.current?.(payload.old.user_id as string)
        )
        .subscribe();

      setUsersChannel(channel);
    }

    return () => {
      if (usersChannel !== null) {
        usersChannel.unsubscribe();
      }
    };
  }, [isInRoom, roomId, onUpdate, onDelete]);
};
