import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { insertMeetingIntoDB } from '@/backend/db/database/meeting/insert';
import { selectMeetingFromDB } from '@/backend/db/database/meeting/select';
import { insertPreferenceIntoDB } from '@/backend/db/database/preference/insert';
import { insertUserIntoDB } from '@/backend/db/database/user/insert';
import type { SchedulorSelection } from '@/sharedTypes';
import type { Meeting } from '@/types/meeting';
import { createMeetingFromMeetingSchema } from '@/types/meeting';
import type { Preference } from '@/types/preference';
import { createPreferenceFromPreferenceSchema } from '@/types/preference';
import type { User } from '@/types/user';
import { createUserFromUserSchema } from '@/types/user';

export type DbContextType = {
  createMeeting: (meetingName: string) => Promise<void>;
  setMeetingId: (meetingId: string) => void;
  signIn: (username: string) => Promise<void>;
  addPreferences: (selections: SchedulorSelection[]) => Promise<void>;
  user: User | null;
  meeting: Meeting | null;
  preference: Preference | null;
};

const DbContextInitialValue: DbContextType = {
  createMeeting: (_) => Promise.resolve(),
  setMeetingId: (_) => {},
  signIn: (_) => Promise.resolve(),
  addPreferences: (_) => Promise.resolve(),
  user: null,
  meeting: null,
  preference: null,
};

export const DbContext = createContext<DbContextType>(DbContextInitialValue);

export type DbProviderProps = { children: ReactNode };

const DbProvider = ({ children }: DbProviderProps) => {
  const supabase = useSupabaseClient();

  const [localUsername, setLocalUsername] = useState<string | null>(null);
  const [localMeetingId, setLocalMeetingId] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  const createMeeting = async (meetingName: string) => {
    const meetingInfo = await insertMeetingIntoDB(supabase, meetingName);

    setMeeting(createMeetingFromMeetingSchema(meetingInfo));
  };

  const setMeetingId = (meetingId: string) => {
    setLocalMeetingId(meetingId);
  };

  const signIn = async (newUsername: string) => {
    setLocalUsername(newUsername);
  };

  // Join meeting with username typed in by user
  // Join meeting with meeting id from url

  const addPreferences = async (selections: SchedulorSelection[]) => {
    if (!localMeetingId) throw new Error('Meeting ID is null');

    const meetingInfo = await selectMeetingFromDB(supabase, localMeetingId);

    setMeeting(createMeetingFromMeetingSchema(meetingInfo));

    if (!localUsername) throw new Error('Username is null');

    const userInfo = await insertUserIntoDB(
      supabase,
      localUsername,
      localMeetingId
    );

    setUser(createUserFromUserSchema(userInfo));

    const preferenceInfo = await insertPreferenceIntoDB(
      supabase,
      localMeetingId,
      userInfo.id,
      selections
    );

    setPreference(createPreferenceFromPreferenceSchema(preferenceInfo));
  };

  return (
    <DbContext.Provider
      value={{
        createMeeting,
        setMeetingId,
        signIn,
        addPreferences,
        user,
        meeting,
        preference,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDbContext = () => useContext(DbContext);
