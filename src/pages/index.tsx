import { Button, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { DbContext } from '@/context/dbContext';
import { useAppDispatch } from '@/store/hooks';
import { createUser } from '@/store/user/actions';
import { useDebounce } from '@/utils/hooks';
import { paths } from '@/utils/paths';
import { validateUsername } from '@/utils/validation';

const Index = () => {
  // Hooks
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { login } = useContext(DbContext);

  // Local states
  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    setIsUsernameValid(validateUsername(newUsername));
  };

  const updateUsernameDebounced = useDebounce(updateUsername, 150);

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value;
    // Debounce change updates
    updateUsernameDebounced(newUsername);
  };

  const onStart = async () => {
    await login(username);
    dispatch(createUser(username));
    router.push(paths.lobby);
  };

  return (
    <Stack sx={{ gap: 4 }}>
      <TextField onChange={onUsernameChange} placeholder={'test-user'} />
      <Button variant="outlined" onClick={onStart} disabled={!isUsernameValid}>
        Get started
      </Button>
    </Stack>
  );
};

export default Index;
