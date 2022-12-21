import { Stack } from '@mui/material';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { range } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import CustomButton from '@/components/Button';
import LeaveMeetingModal from '@/components/Meeting/leaveMeetingModal';
import LoadingScreen from '@/components/Meeting/loadingScreen';
import MeetingDetails from '@/components/Meeting/meetingDetails';
import PreferenceOverlapPreview from '@/components/Meeting/overlapPreview';
import SchedulorModal from '@/components/Meeting/schedulorModal';
import SignInModal from '@/components/Meeting/signInModal';
import { UIAlertContext } from '@/context/Alert/alertContext';
import { DbContext } from '@/context/dbContext';
import { PreferenceSelection } from '@/types/preferenceSelection';
import { Time24 } from '@/types/time24';
import { INTERVAL_SIZE } from '@/utils/constants';
import { paths } from '@/utils/paths';
import { calculateOverlappingPreferences } from '@/utils/preferences';
import { validateUsername } from '@/utils/validation';

const generateSelections = (
  startDate: Date,
  endDate: Date,
  minTime: Time24,
  maxTime: Time24,
  userId: string
) => {
  const numDays = differenceInCalendarDays(endDate, startDate) + 1;

  return range(0, numDays).map((i) => {
    const day = addDays(startDate, i);

    const selection = new PreferenceSelection(
      day,
      minTime,
      maxTime,
      INTERVAL_SIZE,
      userId
    );
    return selection;
  });
};

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
    user,
    meeting,
    preference,
    isSignedIn,
    isExistingUser,
  } = useContext(DbContext);

  const { dispatchErrorAlert } = useContext(UIAlertContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLeaveMeetingModalOpen, setIsLeaveMeetingModalOpen] = useState(false);
  const [isSubmitPreferencesModalOpen, setIsSubmitPreferencesModalOpen] =
    useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [selections, setSelections] = useState<PreferenceSelection[] | null>(
    null
  );

  const isUsernameValid = useMemo(() => {
    return username !== null && validateUsername(username);
  }, [username]);

  const intervalSize = INTERVAL_SIZE;

  const resetStates = () => {
    setUsername(null);
    setIsLoading(true);
    setSelections(null);
  };

  const onSignInClicked = async () => {
    if (!username || !isUsernameValid) return;
    await signIn(username);
    setIsSignInModalOpen(false);
  };

  const onSubmitPreferencesClicked = async (
    newSelections: PreferenceSelection[],
    add: boolean = true
  ) => {
    if (!username) {
      setIsSubmitPreferencesModalOpen(false);
      dispatchErrorAlert('No user signed in');
      return;
    }
    if (!newSelections) {
      setIsSubmitPreferencesModalOpen(false);
      dispatchErrorAlert('No new selections');
      return;
    }

    if (add) {
      await addPreferences(
        router.query.meetingId as string,
        username,
        newSelections
      );
    } else {
      await updatePreferences(newSelections);
    }
    setIsSubmitPreferencesModalOpen(false);
  };

  const onSignOutClicked = async () => {
    if (!isSignedIn) return;

    await signOut();
    resetStates();
  };

  const confirmLeaveMeeting = async () => {
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
      setSelections(preference.selections);
    }
  }, [isExistingUser]);

  // Update selections for new users
  useEffect(() => {
    if (user && meeting?.details && !preference && !isExistingUser) {
      setSelections(
        generateSelections(
          meeting.details.startDate,
          meeting.details.endDate,
          new Time24(meeting.details.minTime),
          new Time24(meeting.details.maxTime),
          user.userId
        )
      );
    }
  }, [meeting]);

  // Calculate preferences overlap
  const overlappingPreferences = useMemo(() => {
    if (meeting?.details && meeting?.preferences) {
      return calculateOverlappingPreferences(
        meeting.preferences,
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
      {!isLoading && meeting?.details && selections ? (
        <>
          <SignInModal
            isOpen={isSignInModalOpen}
            onClose={() => setIsSignInModalOpen(false)}
            onUsernameChanged={setUsername}
            onSignInClicked={onSignInClicked}
            isUsernameValid={isUsernameValid}
          />
          <LeaveMeetingModal
            isOpen={isLeaveMeetingModalOpen}
            onClose={() => setIsLeaveMeetingModalOpen(false)}
            onLeaveMeetingClicked={confirmLeaveMeeting}
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
                gap: 2,
              }}
            >
              <MeetingDetails />
              {isSignedIn && isUsernameValid && (
                <Stack
                  sx={{ gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}
                >
                  <CustomButton
                    color="error"
                    onClick={() => setIsLeaveMeetingModalOpen(true)}
                  >
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
              overlappingPreferences && (
                <PreferenceOverlapPreview
                  overlappingPreferences={overlappingPreferences}
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
