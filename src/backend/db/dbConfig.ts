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
    rooms: {
      schema: 'public',
      table: 'rooms',
      channel: 'rooms',
    },
    users: {
      schema: 'public',
      table: 'users',
      channel: 'users',
    },
    messages: {
      schema: 'public',
      table: 'messages',
      channel: 'messages',
    },
  },
};
