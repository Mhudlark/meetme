import { Button, Stack, TextField } from '@mui/material';
import { useContext, useState } from 'react';

import { DbContext } from '@/context/dbContext';

const Index = () => {
  const { createMeeting } = useContext(DbContext);

  const [meetingName, setMeetingName] = useState<string>('');

  const onMeetingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingName(event.target.value);
  };

  const onCreateEventClicked = async () => {
    await createMeeting(meetingName);
  };

  return (
    <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
      <TextField onChange={onMeetingNameChange} />
      <Button variant="contained" onClick={onCreateEventClicked}>
        Create Event
      </Button>
    </Stack>
  );
};

export default Index;
