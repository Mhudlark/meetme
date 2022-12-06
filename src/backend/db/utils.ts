import type { ClientData } from './helpers';

export const isClientData = (object: any): object is ClientData => {
  return 'user' in object && 'chatMessages' in object;
};
