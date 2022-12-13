import { Stack } from '@mui/material';

import CustomButton from '@/components/Button';

import CustomModal from '../Modal';
import FormFieldStack from '../Styled/formFieldStack';
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
      <Stack sx={{ gap: 2 }}>
        <FormFieldStack label="Username">
          <CustomTextField
            placeholder={'Enter your username...'}
            onChange={(e) => onUsernameChanged(e.target.value)}
          />
        </FormFieldStack>
        <CustomButton onClick={onSignInClicked} disabled={!isUsernameValid}>
          Sign In
        </CustomButton>
      </Stack>
    </CustomModal>
  );
};

export default SignInModal;
