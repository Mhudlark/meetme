import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

import { deleteMeetingFromDB } from '@/backend/db/database/meeting/delete';
import {
  deleteAllPreferencesForMeetingFromDB,
  deletePreferenceFromDB,
} from '@/backend/db/database/preference/delete';
import { insertPreferenceIntoDB } from '@/backend/db/database/preference/insert';
import { updatePreferenceInDB } from '@/backend/db/database/preference/update';
import {
  deleteAllUsersForMeetingFromDB,
  deleteUserFromDB,
} from '@/backend/db/database/user/delete';
import { insertUserIntoDB } from '@/backend/db/database/user/insert';
import meetingUtils from '@/backend/meeting/utils';
import type { Meeting, PartialMeetingDetails } from '@/types/meeting';
import { isMeetingHost } from '@/types/meeting';
import type { Preference } from '@/types/preference';
import { createPreferenceFromPreferenceSchema } from '@/types/preference';
import type { PreferenceSelection } from '@/types/preferenceSelection';
import type { User } from '@/types/user';
import { createUserFromUserSchema } from '@/types/user';
import { validateUsername } from '@/utils/validation';

export type DbContextType = {
  createMeeting: (meetingDetails: PartialMeetingDetails) => Promise<string>;
  getMeeting: (meetingId: string) => Promise<void>;
  joinMeeting: (meetingCode: string) => Promise<string>;
  signIn: (username: string) => Promise<void>;
  addPreferences: (
    meetingId: string,
    selections: PreferenceSelection[]
  ) => Promise<void>;
  updatePreferences: (selections: PreferenceSelection[]) => Promise<void>;
  signOut: () => Promise<void>;
  leaveMeeting: () => Promise<void>;
  deleteMeeting: () => Promise<void>;
  user: User | null;
  meeting: Meeting | null;
  preference: Preference | null;
  isSignedIn: boolean;
  hasUserEnteredPreferences: boolean;
  isHost: boolean;
};

const DbContextInitialValue: DbContextType = {
  createMeeting: (_) => Promise.resolve(''),
  getMeeting: (_) => Promise.resolve(),
  joinMeeting: (_) => Promise.resolve(''),
  signIn: (_) => Promise.resolve(),
  addPreferences: (_, __) => Promise.resolve(),
  updatePreferences: (_) => Promise.resolve(),
  signOut: () => Promise.resolve(),
  leaveMeeting: () => Promise.resolve(),
  deleteMeeting: () => Promise.resolve(),
  user: null,
  meeting: null,
  preference: null,
  isSignedIn: false,
  hasUserEnteredPreferences: false,
  isHost: false,
};

export const DbContext = createContext<DbContextType>(DbContextInitialValue);

export type DbProviderProps = { children: ReactNode };

const DbProvider = ({ children }: DbProviderProps) => {
  const supabase = useSupabaseClient();

  const [user, setUser] = useState<User | null>(null);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const hasUserEnteredPreferences = useMemo(() => !!preference, [preference]);
  const isHost = useMemo(() => {
    return isMeetingHost(meeting, user);
  }, [meeting, user]);

  const createMeeting = async (meetingDetails: PartialMeetingDetails) => {
    const newMeeting = await meetingUtils.createMeeting(
      supabase,
      meetingDetails
    );

    setMeeting(newMeeting);

    return newMeeting.id;
  };

  const getMeeting = async (meetingId: string) => {
    const newMeeting = await meetingUtils.getMeeting(supabase, meetingId);

    setMeeting(newMeeting);
  };

  const joinMeeting = async (meetingCode: string): Promise<string> => {
    const newMeeting = await meetingUtils.joinMeeting(supabase, meetingCode);

    return newMeeting.id;
  };

  const signIn = async (username: string) => {
    if (!meeting) throw new Error('Not in a meeting');
    if (!username || !validateUsername(username))
      throw new Error('Username is invalid');

    const existingUser = meeting.users.filter(
      (meetingUser) => meetingUser.username === username
    )?.[0];

    // Existing user
    if (existingUser) {
      setUser(existingUser);

      const existingUserPreference = meeting?.preferences.filter(
        (meetingPreference) => meetingPreference.userId === existingUser.userId
      )?.[0];

      if (existingUserPreference) setPreference(existingUserPreference);
    }
    // New user
    else {
      const userInfo = await insertUserIntoDB(supabase, username, meeting.id);

      setUser(createUserFromUserSchema(userInfo));
    }

    setIsSignedIn(true);
  };

  const addPreferences = async (
    meetingId: string,
    selections: PreferenceSelection[]
  ) => {
    if (!user) throw new Error('User is not signed in already');

    const preferenceInfo = await insertPreferenceIntoDB(
      supabase,
      meetingId,
      user.userId,
      selections
    );

    setPreference(createPreferenceFromPreferenceSchema(preferenceInfo));

    if (meeting) await getMeeting(meeting.id);
  };

  const updatePreferences = async (selections: PreferenceSelection[]) => {
    if (!user) throw new Error('User is not signed in already');
    if (!meeting) throw new Error('User is not in a meeting');
    if (!preference) throw new Error('User has no existing preferences');

    await updatePreferenceInDB(supabase, meeting.id, user.userId, selections);

    setPreference(preference.copyWithNewSelections(selections));

    if (meeting) await getMeeting(meeting.id);
  };

  const signOut = async () => {
    if (!meeting) throw new Error('User is not in a meeting');

    setPreference(null);
    setUser(null);
    setIsSignedIn(false);
  };

  const leaveMeeting = async () => {
    if (!meeting) throw new Error('User is not in a meeting');
    if (!user) throw new Error('User is not signed in already');

    if (hasUserEnteredPreferences) {
      await deletePreferenceFromDB(supabase, meeting.id, user.userId);
      setPreference(null);
    }

    await deleteUserFromDB(supabase, user.userId);
    setUser(null);
    setMeeting(null);
    setIsSignedIn(false);
  };

  const deleteMeeting = async () => {
    if (!meeting) throw new Error('User is not in a meeting');
    if (!user) throw new Error('User is not signed in already');
    if (!isHost) throw new Error('User is not the host of the meeting');

    const meetingId = meeting.id;

    // Delete preferences first because foreign key (userId, meetingId)
    await deleteAllPreferencesForMeetingFromDB(supabase, meetingId);
    // Delete users next because foreign key (meetingId)
    await deleteAllUsersForMeetingFromDB(supabase, meetingId);
    // Delete meeting last
    await deleteMeetingFromDB(supabase, meetingId);

    setPreference(null);
    setUser(null);
    setMeeting(null);
    setIsSignedIn(false);
  };

  return (
    <DbContext.Provider
      value={{
        createMeeting,
        getMeeting,
        joinMeeting,
        signIn,
        addPreferences,
        updatePreferences,
        signOut,
        leaveMeeting,
        deleteMeeting,
        user,
        meeting,
        preference,
        isSignedIn,
        hasUserEnteredPreferences,
        isHost,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDbContext = () => useContext(DbContext);
