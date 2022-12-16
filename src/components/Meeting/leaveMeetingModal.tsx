import { Box, Stack, Typography } from '@mui/material';

import CustomButton from '@/components/Button';

import CustomModal from '../Modal';

export interface LeaveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaveMeetingClicked: () => void;
}

const LeaveMeetingModal = ({
  isOpen,
  onClose,
  onLeaveMeetingClicked,
}: LeaveMeetingModalProps) => {
  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy="Confirm leave meeting modal"
      sx={{
        pt: {
          xs: 3,
          sm: 4,
        },
        pb: {
          xs: 2,
          sm: 4,
        },
        px: {
          xs: 2,
          sm: 4,
        },
        width: {
          xs: '300px',
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
        <Typography variant="h3">
          Are you sure you want to leave the meeting?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
          }}
        >
          <CustomButton
            style={{ width: '100%' }}
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton
            style={{ width: '100%' }}
            color="error"
            onClick={onLeaveMeetingClicked}
          >
            Leave
          </CustomButton>
        </Box>
      </Stack>
    </CustomModal>
  );
};

export default LeaveMeetingModal;
