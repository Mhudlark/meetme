import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { insertMeetingIntoDB } from '@/backend/db/database/meeting/insert';
import { selectMeetingFromDB } from '@/backend/db/database/meeting/select';
import { insertPreferenceIntoDB } from '@/backend/db/database/preference/insert';
import { insertUserIntoDB } from '@/backend/db/database/user/insert';
import type { SchedulorSelection } from '@/sharedTypes';
import type { Meeting } from '@/types/meeting';
import {
  createMeetingFromBaseMeetingSchema,
  createMeetingFromMeetingSchema,
} from '@/types/meeting';
import type { Preference } from '@/types/preference';
import { createPreferenceFromPreferenceSchema } from '@/types/preference';
import type { User } from '@/types/user';
import { createUserFromUserSchema } from '@/types/user';

export type DbContextType = {
  createMeeting: (meetingName: string) => Promise<string>;
  getMeeting: (meetingId: string) => Promise<void>;
  addPreferences: (
    meetingId: string,
    username: string,
    selections: SchedulorSelection[]
  ) => Promise<void>;
  user: User | null;
  meeting: Meeting | null;
  preference: Preference | null;
};

const DbContextInitialValue: DbContextType = {
  createMeeting: (_) => Promise.resolve(''),
  getMeeting: (_) => Promise.resolve(),
  addPreferences: (_, __, ___) => Promise.resolve(),
  user: null,
  meeting: null,
  preference: null,
};

export const DbContext = createContext<DbContextType>(DbContextInitialValue);

export type DbProviderProps = { children: ReactNode };

const DbProvider = ({ children }: DbProviderProps) => {
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  const createMeeting = async (meetingName: string) => {
    const baseMeetingInfo = await insertMeetingIntoDB(supabase, meetingName);

    setMeeting(createMeetingFromBaseMeetingSchema(baseMeetingInfo));

    return baseMeetingInfo.id;
  };

  const getMeeting = async (meetingId: string) => {
    const meetingInfo = await selectMeetingFromDB(supabase, meetingId);

    setMeeting(createMeetingFromMeetingSchema(meetingInfo));
  };

  const addPreferences = async (
    meetingId: string,
    username: string,
    selections: SchedulorSelection[]
  ) => {
    if (!username) throw new Error('Username is null');

    const userInfo = await insertUserIntoDB(supabase, username, meetingId);

    setUser(createUserFromUserSchema(userInfo));

    const preferenceInfo = await insertPreferenceIntoDB(
      supabase,
      meetingId,
      userInfo.id,
      selections
    );

    setPreference(createPreferenceFromPreferenceSchema(preferenceInfo));

    if (meeting) await getMeeting(meeting.id);
  };

  return (
    <DbContext.Provider
      value={{
        createMeeting,
        getMeeting,
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
