import type { SupabaseClient } from '@supabase/supabase-js';

export type Supabase = SupabaseClient<any, 'public', any>;

export enum ChannelStatus {
  subscribed = 'SUBSCRIBED',
  timedOut = 'TIMED_OUT',
  closed = 'CLOSED',
  error = 'CHANNEL_ERROR',
}
