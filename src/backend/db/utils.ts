import type { ClientData } from './helpers';

export const isClientData = (object: any): object is ClientData => {
  return 'user' in object && 'chatMessages' in object;
};

// export const isCustomPresence = (object: any): object is CustomPresence => {
//   return isClientData(object) && 'presence_ref' in object;
// };
