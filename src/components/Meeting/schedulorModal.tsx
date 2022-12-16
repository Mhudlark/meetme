import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import type { MeetingDetails } from '@/types/meeting';
import type { SchedulorSelection } from '@/types/schedulorSelection';
import { Time24 } from '@/types/time24';
import { INTERVAL_SIZE } from '@/utils/constants';

import CustomButton from '../Button';
import CustomModal from '../Modal';
import GridSchedulor from '../Schedulor/GridSchedulor';

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
        minWidth: { xs: '100%', sm: 'min(720px, 90vw)', md: '720px' },
        maxWidth: { xs: '100%', sm: 'min(740px, 94vw)' },
        maxHeight: { xs: '100%', sm: '90vh' },
        borderRadius: { xs: 0, sm: 1.5 },
        py: {
          xs: 5,
          sm: 6,
        },
        px: {
          xs: 2,
          sm: 4,
        },
        width: {
          xs: '100%',
          sm: 'fit-content',
        },
      }}
    >
      <Stack
        sx={{
          gap: 4,
        }}
      >
        <Typography variant="h2">Pick your preferences</Typography>
        <GridSchedulor
          selections={localSelections}
          onChange={onSelectionsChanged}
          startDate={meetingDetails.startDate}
          endDate={meetingDetails.endDate}
          minTime={Time24.fromNumber(meetingDetails.minTime)}
          maxTime={Time24.fromNumber(meetingDetails.maxTime)}
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
