import { Stack } from '@mui/material';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { range } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import CustomButton from '@/components/Button';
import LoadingScreen from '@/components/Meeting/loadingScreen';
import MeetingDetails from '@/components/Meeting/meetingDetails';
import PreferenceOverlapPreview from '@/components/Meeting/overlapPreview';
import SchedulorModal from '@/components/Meeting/schedulorModal';
import SignInModal from '@/components/Meeting/signInModal';
import { DbContext } from '@/context/dbContext';
import type { SchedulorSelection } from '@/sharedTypes';
import { INTERVAL_SIZE } from '@/types/meeting';
import { Time24 } from '@/types/time24';
import { setDateTimeWithTime24 } from '@/utils/date';
import { paths } from '@/utils/paths';
import { calculateOverlappingPreferences } from '@/utils/preferences';
import { validateUsername } from '@/utils/validation';

const generateSelections = (
  startDate: Date,
  endDate: Date,
  minTime: Time24,
  maxTime: Time24
) => {
  const numDays = differenceInCalendarDays(endDate, startDate) + 1;

  return range(0, numDays).map((i) => {
    const day = addDays(startDate, i);

    const dayStart = setDateTimeWithTime24(day, minTime);
    const dayEnd = setDateTimeWithTime24(day, maxTime);

    const selection: SchedulorSelection = {
      startDate: dayStart,
      endDate: dayEnd,
    };
    return selection;
  });
};

const defaultSelections = generateSelections(
  new Date(),
  addDays(new Date(), 1),
  new Time24(0),
  new Time24(24)
);

const Meeting = () => {
  const router = useRouter();
  const meetingId = router.query.meetingId as string;

  const {
    signIn,
    getMeeting,
    addPreferences,
    updatePreferences,
    signOut,
    leaveMeeting,
    meeting,
    preference,
    isSignedIn,
    isExistingUser,
  } = useContext(DbContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSubmitPreferencesModalOpen, setIsSubmitPreferencesModalOpen] =
    useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [selections, setSelections] =
    useState<SchedulorSelection[]>(defaultSelections);

  const isUsernameValid = useMemo(() => {
    return username !== null && validateUsername(username);
  }, [username]);

  const intervalSize = INTERVAL_SIZE;

  const resetStates = () => {
    setUsername(null);
    setIsLoading(true);
    setSelections(defaultSelections);
  };

  const onSignInClicked = async () => {
    if (!username || !isUsernameValid) return;
    await signIn(username);
    setIsSignInModalOpen(false);
  };

  const onSubmitPreferencesClicked = async (
    newSelections: SchedulorSelection[],
    add: boolean = true
  ) => {
    if (!newSelections || !username) return;

    if (add) {
      await addPreferences(
        router.query.meetingId as string,
        username,
        newSelections
      );
    } else {
      await updatePreferences(selections);
    }
    setIsSubmitPreferencesModalOpen(false);
  };

  const onSignOutClicked = async () => {
    if (!isSignedIn) return;

    await signOut();
    resetStates();
  };

  const onLeaveMeetingClicked = async () => {
    if (!username) return;

    await leaveMeeting(username);
    router.push(paths.home);
  };

  // Get meeting details
  useEffect(() => {
    if (meetingId) {
      getMeeting(meetingId).then(() => {
        setIsLoading(false);
      });
    }
  }, [meetingId, isSignedIn]);

  // Update selections for existing users
  useEffect(() => {
    if (isExistingUser && preference) {
      setSelections(preference.scheduleSelections);
    }
  }, [isExistingUser]);

  // Update selections for new users
  useEffect(() => {
    if (meeting?.details && !preference && !isExistingUser) {
      setSelections(
        generateSelections(
          meeting.details.startDate,
          meeting.details.endDate,
          new Time24(meeting.details.minTime),
          new Time24(meeting.details.maxTime)
        )
      );
    }
  }, [meeting]);

  // Calculate preferences overlap
  const preferencesOverlap = useMemo(() => {
    if (meeting?.details && meeting?.preferences) {
      return calculateOverlappingPreferences(
        meeting.preferences,
        meeting.users,
        meeting.details.startDate,
        meeting.details.endDate,
        new Time24(meeting.details.minTime),
        new Time24(meeting.details.maxTime),
        intervalSize
      );
    }
    return null;
  }, [meeting]);

  return (
    <>
      {!isLoading && meeting?.details ? (
        <>
          <SignInModal
            isOpen={isSignInModalOpen}
            onClose={() => setIsSignInModalOpen(false)}
            onUsernameChanged={setUsername}
            onSignInClicked={onSignInClicked}
            isUsernameValid={isUsernameValid}
          />
          <SchedulorModal
            isOpen={isSubmitPreferencesModalOpen}
            onClose={() => setIsSubmitPreferencesModalOpen(false)}
            variant={!isExistingUser ? 'add' : 'update'}
            meetingDetails={meeting.details}
            selections={selections}
            onSubmitPreferences={(newSelections) =>
              onSubmitPreferencesClicked(newSelections, !isExistingUser)
            }
          />
          <Stack sx={{ gap: 10, width: '100%', height: '100%' }}>
            <Stack
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'start', md: 'center' },
                gap: 2,
              }}
            >
              <MeetingDetails />
              {isSignedIn && isUsernameValid && (
                <Stack sx={{ gap: 2 }}>
                  <CustomButton color="error" onClick={onLeaveMeetingClicked}>
                    Leave Meeting
                  </CustomButton>
                  <CustomButton color="warning" onClick={onSignOutClicked}>
                    Sign out
                  </CustomButton>
                </Stack>
              )}
            </Stack>
            {!isSignedIn && (
              <>
                <CustomButton onClick={() => setIsSignInModalOpen(true)}>
                  Sign In
                </CustomButton>
              </>
            )}
            {isSignedIn && (
              <>
                <CustomButton
                  onClick={() => setIsSubmitPreferencesModalOpen(true)}
                >
                  {isExistingUser
                    ? 'Update your preferences'
                    : 'Add your preferences'}
                </CustomButton>
              </>
            )}
            {meeting?.preferences &&
              Array.isArray(meeting.preferences) &&
              meeting.preferences.length > 0 &&
              preferencesOverlap && (
                <PreferenceOverlapPreview
                  preferencesOverlap={preferencesOverlap}
                />
              )}
          </Stack>
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Meeting;
