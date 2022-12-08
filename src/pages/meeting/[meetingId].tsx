import { Button, Stack, TextField, Typography } from '@mui/material';
import { addDays, setHours } from 'date-fns';
import { range } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import LineSchedulor from '@/components/Schedulor/LineSchedulor';
import { DbContext } from '@/context/dbContext';
import type { SchedulorSelection } from '@/sharedTypes';

const Meeting = () => {
  const router = useRouter();
  const meetingId = router.query.meetingId as string;

  const { addPreferences, meeting, getMeeting } = useContext(DbContext);

  const [username, setUsername] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [haveEnteredPreferences, setHaveEnteredPreferences] = useState(false);

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
    setIsSignedIn(true);
  };

  const onAddPreferencesClicked = async () => {
    if (!selections || !username) {
      console.log('selections', selections);
      console.log('username', username);
      return;
    }

    await addPreferences(
      router.query.meetingId as string,
      username,
      selections
    );
    setHaveEnteredPreferences(true);
  };

  const isUsernameValid = useMemo(() => {
    return username !== null && username !== '';
  }, [username]);

  useEffect(() => {
    if (meetingId) {
      console.log('useEffect getMeeting', meetingId);
      getMeeting(meetingId);
    }
  }, [meetingId]);

  return (
    <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
      <Stack sx={{ gap: 1 }}>
        <Typography variant="h3">{meeting?.name}</Typography>
        <Typography variant="caption">{meeting?.id}</Typography>
        <Typography variant="body1">{`Users: ${meeting?.users
          ?.map?.((user) => user.username)
          ?.join(', ')}`}</Typography>
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
      {isSignedIn && !haveEnteredPreferences && (
        <>
          <LineSchedulor
            selections={selections}
            onChange={setSelections}
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
      {isSignedIn && haveEnteredPreferences && (
        <>
          {meeting?.preferences?.map?.((preference, index) => (
            <div key={index}>{preference.toString()}</div>
          ))}
        </>
      )}
    </Stack>
  );
};

export default Meeting;