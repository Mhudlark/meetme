import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { insertMeetingIntoDB } from '@/backend/db/database/meeting/insert';
import { selectMeetingFromDB } from '@/backend/db/database/meeting/select';
import { deletePreferenceFromDB } from '@/backend/db/database/preference/delete';
import { insertPreferenceIntoDB } from '@/backend/db/database/preference/insert';
import { updatePreferenceInDB } from '@/backend/db/database/preference/update';
import { deleteUserFromDB } from '@/backend/db/database/user/delete';
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
import { validateUsername } from '@/utils/validation';

export type DbContextType = {
  createMeeting: (meetingName: string) => Promise<string>;
  getMeeting: (meetingId: string) => Promise<void>;
  signIn: (username: string) => Promise<void>;
  addPreferences: (
    meetingId: string,
    username: string,
    selections: SchedulorSelection[]
  ) => Promise<void>;
  updatePreferences: (selections: SchedulorSelection[]) => Promise<void>;
  leaveMeeting: (username: string) => Promise<void>;
  user: User | null;
  meeting: Meeting | null;
  preference: Preference | null;
  isSignedIn: boolean;
  isExistingUser: boolean;
};

const DbContextInitialValue: DbContextType = {
  createMeeting: (_) => Promise.resolve(''),
  getMeeting: (_) => Promise.resolve(),
  signIn: (_) => Promise.resolve(),
  addPreferences: (_, __, ___) => Promise.resolve(),
  updatePreferences: (_) => Promise.resolve(),
  leaveMeeting: (_) => Promise.resolve(),
  user: null,
  meeting: null,
  preference: null,
  isSignedIn: false,
  isExistingUser: false,
};

export const DbContext = createContext<DbContextType>(DbContextInitialValue);

export type DbProviderProps = { children: ReactNode };

const DbProvider = ({ children }: DbProviderProps) => {
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  // A user can be signed in locally without being in the database (yet)
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isExistingUser = useMemo(() => !!preference, [preference]);

  const createMeeting = async (meetingName: string) => {
    const baseMeetingInfo = await insertMeetingIntoDB(supabase, meetingName);

    setMeeting(createMeetingFromBaseMeetingSchema(baseMeetingInfo));

    return baseMeetingInfo.id;
  };

  const getMeeting = async (meetingId: string) => {
    const meetingInfo = await selectMeetingFromDB(supabase, meetingId);

    setMeeting(createMeetingFromMeetingSchema(meetingInfo));
  };

  const signIn = async (username: string) => {
    if (!meeting) throw new Error('Not in a meeting');

    const existingUser = meeting.users.filter(
      (meetingUser) => meetingUser.username === username
    )?.[0];

    if (existingUser) {
      const existingUserPreference = meeting?.preferences.filter(
        (meetingPreference) => meetingPreference.userId === existingUser.userId
      )?.[0];

      if (!existingUserPreference)
        throw new Error('Existing user has no preferences');

      setUser(existingUser as User);
      setPreference(existingUserPreference as Preference);
    }

    setIsSignedIn(true);
  };

  const addPreferences = async (
    meetingId: string,
    username: string,
    selections: SchedulorSelection[]
  ) => {
    if (!username || !validateUsername(username))
      throw new Error('Username is invalid');

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

  const updatePreferences = async (selections: SchedulorSelection[]) => {
    if (!user) throw new Error('User is not signed in already');
    if (!meeting) throw new Error('User is not in a meeting');
    if (!preference) throw new Error('User has no existing preferences');

    await updatePreferenceInDB(supabase, meeting.id, user.userId, selections);

    setPreference(preference.copyWithNewSelections(selections));

    if (meeting) await getMeeting(meeting.id);
  };

  const leaveMeeting = async (username: string) => {
    if (!meeting) throw new Error('User is not in a meeting');

    const existingUser = meeting.users.filter(
      (meetingUser) => meetingUser.username === username
    )?.[0];

    if (existingUser) {
      if (!user) throw new Error('User is not signed in already');
      if (!preference) throw new Error('User has no existing preferences');

      await deletePreferenceFromDB(supabase, meeting.id, user.userId);
      await deleteUserFromDB(supabase, user.userId);

      setUser(null);
      setPreference(null);
    }
    setMeeting(null);
    setIsSignedIn(false);
  };

  return (
    <DbContext.Provider
      value={{
        createMeeting,
        getMeeting,
        signIn,
        addPreferences,
        updatePreferences,
        leaveMeeting,
        user,
        meeting,
        preference,
        isSignedIn,
        isExistingUser,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDbContext = () => useContext(DbContext);
