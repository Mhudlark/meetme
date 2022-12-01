export const RealtimeChannelTypes = {
  broadcast: 'broadcast',
  presence: 'presence',
} as const;

export type RealtimeChannelType =
  typeof RealtimeChannelTypes[keyof typeof RealtimeChannelTypes];

// ==================== PRESENCE ======================

export enum PresenceChannelEvent {
  sync = 'sync',
  join = 'join',
  leave = 'leave',
}

export type Presence = {
  presence_ref: string;
  [key: string]: any;
};

export enum PresenceTrackStatus {
  ok = 'ok',
  timedOut = 'timed out',
  rateLimited = 'rate limited',
}
