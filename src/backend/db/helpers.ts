import type { User } from '@/sharedTypes';

export interface ClientData {
  user: User;
  chatMessages: string[];
}
