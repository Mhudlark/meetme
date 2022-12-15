import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import type { SchedulorSelection } from '@/sharedTypes';
import type { MeetingDetails } from '@/types/meeting';
import { INTERVAL_SIZE } from '@/types/meeting';

import CustomButton from '../Button';
import CustomModal from '../Modal';
import LineSchedulor from '../Schedulor/LineSchedulor';

const variantInfos = {
  add: {
    submitButtonLabel: 'Add your preferences',
  },
  update: {
    submitButtonLabel: 'Update your preferences',
  },
};

export interface SchedulorModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'add' | 'update';
  meetingDetails: MeetingDetails;
  selections: SchedulorSelection[];
  onSubmitPreferences: (selections: SchedulorSelection[]) => void;
}

const SchedulorModal = ({
  isOpen,
  onClose,
  variant,
  meetingDetails,
  selections,
  onSubmitPreferences,
}: SchedulorModalProps) => {
  const variantInfo = variantInfos[variant];

  const [localSelections, setLocalSelections] =
    useState<SchedulorSelection[]>(selections);
  const [haveSelectionsChanged, setHaveSelectionsChanged] = useState(false);

  const onSelectionsChanged = (newSelections: SchedulorSelection[]) => {
    setLocalSelections(newSelections);
    setHaveSelectionsChanged(true);
  };

  const onSubmitSelectionsClicked = () => {
    onSubmitPreferences(localSelections);
    setHaveSelectionsChanged(false);
  };

  useEffect(() => {
    setLocalSelections(selections);
  }, [selections]);

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy="Schedulor in modal"
      sx={{
        maxWidth: { xs: '100vw', sm: 'min(740px, 94vw)' },
        maxHeight: { xs: '100vh', sm: '90vh' },
      }}
    >
      <Stack
        sx={{
          gap: 4,
          py: {
            xs: 2,
            sm: 4,
          },
          px: {
            xs: 1,
            sm: 2,
          },
          width: {
            xs: '96vw',
            sm: 'min(680px, 84vw)',
          },
        }}
      >
        <Typography variant="h2">Pick your preferences</Typography>
        <LineSchedulor
          selections={localSelections}
          onChange={onSelectionsChanged}
          startDate={meetingDetails.startDate}
          endDate={meetingDetails.endDate}
          minTime={meetingDetails.minTime}
          maxTime={meetingDetails.maxTime}
          intervalSize={INTERVAL_SIZE}
        />
        <CustomButton onClick={onSubmitSelectionsClicked}>
          {haveSelectionsChanged ? variantInfo.submitButtonLabel : 'Cancel'}
        </CustomButton>
      </Stack>
    </CustomModal>
  );
};

export default SchedulorModal;
