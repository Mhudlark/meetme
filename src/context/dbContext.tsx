import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { insertMeetingIntoDB } from '@/backend/db/database/meeting/insert';
import type { User } from '@/sharedTypes';
import { useAppDispatch } from '@/store/hooks';
import type { Meeting } from '@/types/meeting';
import { createMeetingFromMeetingSchema } from '@/types/meeting';
import type { Preference } from '@/types/preference';

export type DbContextType = {
  createMeeting: (meetingName: string) => Promise<void>;
};

const DbContextInitialValue: DbContextType = {
  createMeeting: (_) => Promise.resolve(),
};

export const DbContext = createContext<DbContextType>(DbContextInitialValue);

export type DbProviderProps = { children: ReactNode };

const DbProvider = ({ children }: DbProviderProps) => {
  const dispatch = useAppDispatch();
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  const createMeeting = async (meetingName: string) => {
    console.log('createRoom');

    const meetingInfo = await insertMeetingIntoDB(supabase, meetingName);

    setMeeting(createMeetingFromMeetingSchema(meetingInfo));
  };

  return (
    <DbContext.Provider
      value={{
        createMeeting,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDbContext = () => useContext(DbContext);
