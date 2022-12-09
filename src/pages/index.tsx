import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';

import Button from '@/components/Button';
import Stack from '@/components/Stack';
import TextField from '@/components/TextField';
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
    <Stack
      sx={{
        gap: '24px',
        width: '100%',
        height: '100%',
      }}
    >
      <TextField placeholder={'Meeting name'} onChange={onMeetingNameChange} />
      <Button
        onClick={onCreateEventClicked}
        disabled={!isMeetingNameValid}
        sx={{ width: 'fit-content' }}
      >
        Create Event
      </Button>
    </Stack>
  );
};

export default Index;
