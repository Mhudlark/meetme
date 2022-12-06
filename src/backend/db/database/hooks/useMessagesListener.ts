import type { RealtimeChannel } from '@supabase/realtime-js';
import { useEffect, useRef, useState } from 'react';

import { dbConfig } from '../../dbConfig';
import type { Supabase } from '../../types';
import { preferencesSchema } from '../schemas/preferences';
import type { PreferenceSchema } from '../schemas/types';
import { PostGresEventType } from '../types';

export const useMessagesListener = (
  supabase: Supabase,
  isInRoom: boolean,
  roomId?: string,
  onSync?: (newMessage: PreferenceSchema) => void
) => {
  const savedOnSync = useRef<(newMessage: PreferenceSchema) => void>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler
  // without us needing to pass it in effect deps array
  // and potentially cause effect to re-run every render.
  useEffect(() => {
    savedOnSync.current = onSync;
  }, [onSync]);

  const [messagesChannel, setMessagesChannel] =
    useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (isInRoom && roomId) {
      const messagesConfig = dbConfig.channels.preferences;

      const channel = supabase
        .channel(messagesConfig.channel)
        .on(
          'postgres_changes',
          {
            event: PostGresEventType.INSERT,
            schema: messagesConfig.schema,
            table: messagesConfig.table,
            filter: `${preferencesSchema.room_id}=eq.${roomId}`,
          },
          (payload) => savedOnSync.current?.(payload.new as PreferenceSchema)
        )
        .subscribe();

      setMessagesChannel(channel);
    }

    return () => {
      if (messagesChannel !== null) {
        messagesChannel.unsubscribe();
      }
    };
  }, [isInRoom, roomId, onSync]);
};
