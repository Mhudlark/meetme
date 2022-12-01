import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { useDbContext } from '@/context/dbContext';
import { paths } from '@/utils/paths';

const Lobby = () => {
  // Hooks
  const router = useRouter();
  const { createRoom } = useDbContext();

  const join = () => {
    router.push(paths.join);
  };

  const host = async () => {
    try {
      await createRoom();
      router.push(paths.room);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack sx={{ gap: 4 }}>
      <Button variant="outlined" onClick={join}>
        Join
      </Button>
      <Button variant="outlined" onClick={host}>
        Host
      </Button>
    </Stack>
  );
};

export default Lobby;
