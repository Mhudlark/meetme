import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { addDays, setHours } from 'date-fns';
import { range } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import PreferencesOverlapPreview from '@/components/PreferenceOverlapPreview';
import LineSchedulor from '@/components/Schedulor/LineSchedulor';
import { DbContext } from '@/context/dbContext';
import type { SchedulorSelection } from '@/sharedTypes';
import { Time24 } from '@/types/time24';
import { paths } from '@/utils/paths';
import { calculateOverlappingPreferences } from '@/utils/preferences';
import { validateUsername } from '@/utils/validation';

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
    user,
    preference,
    isSignedIn,
    isExistingUser,
  } = useContext(DbContext);

  const [username, setUsername] = useState<string | null>(null);
  const [haveSelectionsChanged, setHaveSelectionsChanged] = useState(false);

  const isUsernameValid = useMemo(() => {
    return username !== null && validateUsername(username);
  }, [username]);

  const numDays = 5;
  const schedulorStartDate = new Date('2022-12-08');
  const schedulorEndDate = addDays(schedulorStartDate, numDays);
  const minTime = 17;
  const maxTime = 23;
  const intervalSize = 1;

  const [selections, setSelections] = useState<SchedulorSelection[]>(
    range(0, numDays).map((i) => {
      const day = addDays(schedulorStartDate, i);
      const startDate = setHours(day, minTime);
      const endDate = setHours(startDate, maxTime);
      const selection: SchedulorSelection = {
        startDate,
        endDate,
      };
      return selection;
    })
  );

  const onUsernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onSignInClicked = async () => {
    if (!username || !isUsernameValid) return;
    await signIn(username);
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
    setUsername(null);
  };

  const onLeaveMeetingClicked = async () => {
    if (!username) return;

    await leaveMeeting(username);
    router.push(paths.home);
  };

  useEffect(() => {
    if (meetingId) getMeeting(meetingId);
  }, [meetingId]);

  useEffect(() => {
    if (isExistingUser && preference) {
      setSelections(preference.scheduleSelections);
      setHaveSelectionsChanged(false);
    }
  }, [isExistingUser]);

  const preferencesOverlap = useMemo(() => {
    if (meeting?.preferences) {
      return calculateOverlappingPreferences(
        meeting.preferences,
        meeting.users,
        schedulorStartDate,
        schedulorEndDate,
        new Time24(minTime),
        new Time24(maxTime),
        intervalSize
      );
    }
    return null;
  }, [meeting]);

  return (
    <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
      <Stack
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 2,
        }}
      >
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h3">{meeting?.name}</Typography>
          {/* {isSignedIn && <Typography variant="h6">{username}</Typography>} */}
          <Typography variant="caption">{meeting?.id}</Typography>
          <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 0.5 }}>
            {meeting?.users
              ?.filter((meetingUser) => meetingUser.username !== user?.username)
              .map((meetingUser) => (
                <Box
                  key={meetingUser.username}
                  sx={{
                    backgroundColor: '#f2f2f288',
                    borderRadius: 1,
                    p: 0.5,
                  }}
                >
                  {meetingUser.username}
                </Box>
              ))}
          </Stack>
        </Stack>
        {isSignedIn && isUsernameValid && (
          <Stack sx={{ gap: 2 }}>
            <Button
              color="error"
              variant="outlined"
              onClick={onLeaveMeetingClicked}
              sx={{ height: 'fit-content' }}
            >
              Leave Meeting
            </Button>
            <Button
              color="warning"
              variant="outlined"
              onClick={onSignOutClicked}
              sx={{ height: 'fit-content' }}
            >
              Sign out
            </Button>
          </Stack>
        )}
      </Stack>
      {!isSignedIn && (
        <>
          <TextField placeholder={'Username'} onChange={onUsernameChanged} />
          <Button
            variant="outlined"
            onClick={onSignInClicked}
            disabled={!isUsernameValid}
          >
            Sign In
          </Button>
        </>
      )}
      {isSignedIn && !isExistingUser && (
        <>
          <LineSchedulor
            selections={selections}
            onChange={onSelectionsChanged}
            startDate={schedulorStartDate}
            endDate={schedulorEndDate}
            minTime={minTime}
            maxTime={maxTime}
            intervalSize={intervalSize}
          />
          <Button variant="outlined" onClick={onAddPreferencesClicked}>
            Add preferences
          </Button>
        </>
      )}
      {isSignedIn && isExistingUser && (
        <>
          <LineSchedulor
            selections={selections}
            onChange={onSelectionsChanged}
            startDate={schedulorStartDate}
            endDate={schedulorEndDate}
            minTime={minTime}
            maxTime={maxTime}
            intervalSize={intervalSize}
          />
          <Button
            variant="outlined"
            onClick={onUpdatePreferencesClicked}
            disabled={!haveSelectionsChanged}
          >
            Update preferences
          </Button>
        </>
      )}
      <Typography variant="h5">Preferences</Typography>
      {meeting?.preferences && (
        <PreferencesOverlapPreview preferencesOverlap={preferencesOverlap} />
      )}
    </Stack>
  );
};

export default Meeting;
