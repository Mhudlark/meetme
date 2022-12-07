import { Button, Stack } from '@mui/material';
import { useContext } from 'react';

import { DbContext } from '@/context/dbContext';

const Index = () => {
  const { createRoom } = useContext(DbContext);

  const onCreateEventClicked = async () => {
    await createRoom();
  };

  return (
    <Stack sx={{ gap: 4, width: '100%', height: '100%' }}>
      <Button variant="contained" onClick={onCreateEventClicked}>
        Create Event
      </Button>
    </Stack>
  );
};

export default Index;
