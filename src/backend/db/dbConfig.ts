export const dbConfig = {
  // The number of realtime db event updates per second
  defaultEventsPerSecond: 5,
  realtime: {
    broadcast: {
      // The interval between broadcasts as a publisher on realtime db, in ms
      defaultBroadcastPublishInterval: 200,
    },
  },
  channels: {
    meetings: {
      schema: 'public',
      table: 'Meetings',
      channel: 'Meetings',
    },
    users: {
      schema: 'public',
      table: 'Users',
      channel: 'Users',
    },
    preferences: {
      schema: 'public',
      table: 'Preferences',
      channel: 'Preferences',
    },
  },
};
