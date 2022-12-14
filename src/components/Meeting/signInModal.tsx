import { Stack, Typography } from '@mui/material';

import CustomButton from '@/components/Button';

import CustomModal from '../Modal';
import CustomTextField from '../TextField';

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsernameChanged: (username: string) => void;
  onSignInClicked: () => void;
  isUsernameValid: boolean;
}

const SignInModal = ({
  isOpen,
  onClose,
  onUsernameChanged,
  onSignInClicked,
  isUsernameValid,
}: SignInModalProps) => {
  return (
    <CustomModal open={isOpen} onClose={onClose} ariaLabelledBy="Sign in modal">
      <Stack
        sx={{
          gap: 4,
          alignItems: 'center',
          py: {
            xs: 2,
            sm: 4,
          },
          px: {
            xs: 1,
            sm: 4,
          },
          width: {
            xs: '320px',
            sm: '400px',
          },
        }}
      >
        <Typography variant="h2">Join the meeting</Typography>
        <CustomTextField
          placeholder={'Enter your username...'}
          onChange={(e) => onUsernameChanged(e.target.value)}
        />
        <CustomButton onClick={onSignInClicked} disabled={!isUsernameValid}>
          Join
        </CustomButton>
      </Stack>
    </CustomModal>
  );
};

export default SignInModal;
