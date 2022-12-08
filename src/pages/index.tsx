import { Button, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';

import { DbContext } from '@/context/dbContext';
import { paths } from '@/utils/paths';
import { validateMeetingName } from '@/utils/validation';

const Index = () => {
  const router = useRouter();
  const { createMeeting } = useContext(DbContext);

  const [meetingName, setMeetingName] = useState<string>('');
  const isMeetingNameValid = useMemo(
    () => validateMeetingName(meetingName),
    [meetingName]
  );

  const onMeetingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingName(event.target.value);
  };

  const onCreateEventClicked = async () => {
    const meetingId = await createMeeting(meetingName);
    router.push(`${paths.meeting}/${meetingId}`);
  };

  return (
    <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
      <TextField placeholder={'Meeting name'} onChange={onMeetingNameChange} />
      <Button
        variant="outlined"
        onClick={onCreateEventClicked}
        disabled={!isMeetingNameValid}
      >
        Create Event
      </Button>
    </Stack>
  );
};

export default Index;
