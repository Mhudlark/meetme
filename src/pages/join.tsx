import { Button, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useDbContext } from '@/context/dbContext';
import { useDebounce } from '@/utils/hooks';
import { paths } from '@/utils/paths';
import { validateRoomName } from '@/utils/validation';

const Index = () => {
  // Hooks
  const router = useRouter();
  const { joinRoom } = useDbContext();

  // Local states
  const [roomName, setRoomName] = useState('');
  const [isRoomNameValid, setIsRoomNameValid] = useState(false);

  const updateRoomName = (newRoomName: string) => {
    setRoomName(newRoomName);
    setIsRoomNameValid(validateRoomName(newRoomName));
  };

  const updateRoomNameDebounced = useDebounce(updateRoomName, 150);

  const onRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRoomName = event.target.value;
    // Debounce change updates
    updateRoomNameDebounced(newRoomName);
  };

  const onJoin = async () => {
    try {
      await joinRoom(roomName);
      router.push(paths.room);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack sx={{ gap: 4 }}>
      <TextField onChange={onRoomNameChange} />
      <Button variant="outlined" onClick={onJoin} disabled={!isRoomNameValid}>
        Join
      </Button>
    </Stack>
  );
};

export default Index;
