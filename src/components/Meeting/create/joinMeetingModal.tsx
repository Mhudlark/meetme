import { Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import CustomButton from '@/components/Button';
import CustomModal from '@/components/Modal';
import CustomTextField from '@/components/TextField';
import { validateMeetingCode } from '@/utils/validation';

export interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinMeeting: (meetingCode: string) => Promise<void>;
  isJoinMeetingLoading: boolean;
}

const JoinMeetingModal = ({
  isOpen,
  onClose,
  onJoinMeeting,
  isJoinMeetingLoading,
}: JoinMeetingModalProps) => {
  const [meetingCode, setMeetingCode] = useState<string | null>(null);

  const isMeetingCodeValid = useMemo(() => {
    return meetingCode !== null && validateMeetingCode(meetingCode);
  }, [meetingCode]);

  const onJoinMeetingClicked = async () => {
    if (!isMeetingCodeValid) return;

    await onJoinMeeting(meetingCode!);
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy="Sign in modal"
      sx={{
        py: {
          xs: 3,
          sm: 6,
        },
        px: {
          xs: 2,
          sm: 6,
        },
        width: {
          xs: '320px',
          sm: '400px',
        },
      }}
    >
      <Stack
        sx={{
          gap: 4,
          alignItems: 'center',
        }}
      >
        <Typography variant="h2">Join the meeting</Typography>
        <CustomTextField
          placeholder={'Enter the meeting code...'}
          onChange={(e: any) => setMeetingCode(e.target.value)}
        />
        <Stack sx={{ flexDirection: 'row', gap: 1, width: '100%' }}>
          <CustomButton
            onClick={() => onClose()}
            color="secondary"
            style={{ width: '50%' }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            onClick={onJoinMeetingClicked}
            isLoading={isJoinMeetingLoading}
            disabled={!isMeetingCodeValid}
            style={{ width: '50%' }}
          >
            Join
          </CustomButton>
        </Stack>
      </Stack>
    </CustomModal>
  );
};

export default JoinMeetingModal;
