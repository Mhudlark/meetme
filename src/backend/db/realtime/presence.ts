import type {
  RealtimeChannel,
  RealtimePresenceJoinPayload,
  RealtimePresenceLeavePayload,
  RealtimePresenceState,
} from '@supabase/supabase-js';

import type { Supabase } from '../types';
import { ChannelStatus } from '../types';
import type { Presence } from './types';
import { PresenceChannelEvent, RealtimeChannelTypes } from './types';

export const addPresenceChannel = async (
  supabase: Supabase,
  channelName: string,
  onJoin?: (newPresences: Presence[]) => void,
  onSync?: (state: RealtimePresenceState) => void,
  onLeave?: (leftPresences: Presence[]) => void,
  onSubscribe?: () => void
): Promise<RealtimeChannel> => {
  const channel = supabase.channel(channelName);

  // Listen to client join events
  if (onJoin)
    channel.on(
      RealtimeChannelTypes.presence,
      { event: PresenceChannelEvent.join },
      ({ newPresences }: RealtimePresenceJoinPayload) => onJoin(newPresences)
    );

  if (onSync)
    // Listen to sync (update) events
    channel.on(
      RealtimeChannelTypes.presence,
      { event: PresenceChannelEvent.sync },
      () => onSync(channel.presenceState())
    );

  if (onLeave)
    // Listen to client leave events
    channel.on(
      RealtimeChannelTypes.presence,
      { event: PresenceChannelEvent.leave },
      ({ leftPresences }: RealtimePresenceLeavePayload) =>
        onLeave(leftPresences)
    );

  channel.subscribe(async (status) => {
    if (status === ChannelStatus.subscribed) {
      onSubscribe?.();
    }
  });

  return channel;
};
