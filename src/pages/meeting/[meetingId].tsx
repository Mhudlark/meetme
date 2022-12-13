import { CircularProgress, Stack, Typography } from '@mui/material';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { range } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import CustomButton from '@/components/Button';
import MeetingDetails from '@/components/Meeting/meetingDetails';
import PreferenceOverlapPreview from '@/components/Meeting/overlapPreview';
import SignInModal from '@/components/Meeting/signInModal';
import LineSchedulor from '@/components/Schedulor/LineSchedulor';
import { DbContext } from '@/context/dbContext';
import type { SchedulorSelection } from '@/sharedTypes';
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

  const [username, setUsername] = useState<string | null>(null);
  const [selections, setSelections] =
    useState<SchedulorSelection[]>(defaultSelections);
  const [haveSelectionsChanged, setHaveSelectionsChanged] = useState(false);

  const isUsernameValid = useMemo(() => {
    return username !== null && validateUsername(username);
  }, [username]);

  const intervalSize = 1;

  const resetStates = () => {
    setUsername(null);
    setIsLoading(true);
    setHaveSelectionsChanged(false);
    setSelections(defaultSelections);
  };

  const onSignInClicked = async () => {
    if (!username || !isUsernameValid) return;
    await signIn(username);
    setIsSignInModalOpen(false);
  };

  const onSelectionsChanged = (newSelections: SchedulorSelection[]) => {
    setSelections(newSelections);
    setHaveSelectionsChanged(true);
  };

  const onAddPreferencesClicked = async () => {
    if (!selections || !username) return;

    await addPreferences(
      router.query.meetingId as string,
      username,
      selections
    );

    setHaveSelectionsChanged(false);
  };

  const onUpdatePreferencesClicked = async () => {
    if (!selections || !username) return;

    await updatePreferences(selections);

    setHaveSelectionsChanged(false);
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
      setHaveSelectionsChanged(false);
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
    <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
      {!isLoading && meeting?.details ? (
        <>
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
              <SignInModal
                isOpen={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
                onUsernameChanged={setUsername}
                onSignInClicked={onSignInClicked}
                isUsernameValid={isUsernameValid}
              />
            </>
          )}
          {isSignedIn && !isExistingUser && (
            <>
              <LineSchedulor
                selections={selections}
                onChange={onSelectionsChanged}
                startDate={meeting.details.startDate}
                endDate={meeting.details.endDate}
                minTime={meeting.details.minTime}
                maxTime={meeting.details.maxTime}
                intervalSize={intervalSize}
              />
              <CustomButton onClick={onAddPreferencesClicked}>
                Add preferences
              </CustomButton>
            </>
          )}
          {isSignedIn && isExistingUser && selections && (
            <>
              <LineSchedulor
                selections={selections}
                onChange={onSelectionsChanged}
                startDate={meeting.details.startDate}
                endDate={meeting.details.endDate}
                minTime={meeting.details.minTime}
                maxTime={meeting.details.maxTime}
                intervalSize={intervalSize}
              />
              <CustomButton
                onClick={onUpdatePreferencesClicked}
                disabled={!haveSelectionsChanged}
              >
                Update preferences
              </CustomButton>
            </>
          )}
          {meeting?.preferences &&
            Array.isArray(meeting.preferences) &&
            meeting.preferences.length > 0 && (
              <Stack sx={{ gap: 2 }}>
                <Typography
                  variant="h5"
                  sx={{ backgroundColor: '#e1e1e1', borderRadius: 1, p: 1 }}
                >
                  Preferences
                </Typography>

                <PreferenceOverlapPreview
                  preferencesOverlap={preferencesOverlap}
                />
              </Stack>
            )}
        </>
      ) : (
        <CircularProgress />
      )}
    </Stack>
  );
};

export default Meeting;
