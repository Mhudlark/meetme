import type { User } from '@/sharedTypes';

export const mockUser: User = {
  userId: '0123',
  username: 'mock-user',
};

export const mockUser1: User = {
  userId: '1234',
  username: 'mock-user-1',
};

export const mockUser2: User = {
  userId: '2345',
  username: 'mock-user-2',
};

export const mockUser3: User = {
  userId: '3456',
  username: 'mock-user-3',
};

export const mockUser4: User = {
  userId: '4567',
  username: 'mock-user-3',
};

export const mockUser5: User = {
  userId: '5678',
  username: 'mock-user-3',
};

export const mockUser6: User = {
  userId: '6789',
  username: 'mock-user-3',
};

export const getMockUser = async () => mockUser;
