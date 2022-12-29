import { Stack, Typography } from '@mui/material';
import { addDays } from 'date-fns';
import { useMemo, useState } from 'react';

import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import CustomModal from '@/components/Modal';
import FormFieldStack from '@/components/Styled/formFieldStack';
import CustomTextArea from '@/components/TextArea';
import CustomTextField from '@/components/TextField';
import TimePicker from '@/components/TimePicker';
import type { PartialMeetingDetails } from '@/types/meeting';
import { Time24 } from '@/types/time24';
import { validateMeetingName } from '@/utils/validation';

const formIntialValues = {
  meetingName: '',
  description: '',
  startDate: new Date(),
  endDate: addDays(new Date(), 7),
  minTime: new Time24(9, 0),
  maxTime: new Time24(17, 0),
};

export interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMeeting: (meetingDetails: PartialMeetingDetails) => Promise<void>;
  isCreateMeetingLoading: boolean;
}

const CreateMeetingModal = ({
  isOpen,
  onClose,
  onCreateMeeting,
  isCreateMeetingLoading,
}: CreateModalProps) => {
  const [meetingName, setMeetingName] = useState<string>(
    formIntialValues.meetingName
  );
  const [description, setDescription] = useState<string>(
    formIntialValues.description
  );
  const [startDate, setStartDate] = useState<Date>(formIntialValues.startDate);
  const [endDate, setEndDate] = useState<Date>(formIntialValues.endDate);
  const [minTime, setMinTime] = useState<Time24>(formIntialValues.minTime);
  const [maxTime, setMaxTime] = useState<Time24>(formIntialValues.maxTime);

  const isMeetingNameValid = useMemo(
    () => validateMeetingName(meetingName),
    [meetingName]
  );

  const onMeetingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingName(event.target.value);
  };

  const onCreateMeetingClicked = () => {
    if (!isMeetingNameValid) throw new Error('Meeting name is invalid');
    // if (!description) throw new Error('Description is invalid');
    if (!startDate) throw new Error('Start date is invalid');
    if (!endDate) throw new Error('End date is invalid');
    if (!minTime) throw new Error('Min time is invalid');
    if (!maxTime) throw new Error('Max time is invalid');

    const meetingDetails: PartialMeetingDetails = {
      name: meetingName,
      description,
      startDate,
      endDate,
      minTime: minTime.valueOf(),
      maxTime: maxTime.valueOf(),
    };

    onCreateMeeting(meetingDetails);
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      ariaLabelledBy="Create meeting flow in modal"
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
        <Typography variant="h2">{'Create a new meeting'}</Typography>
        <Stack
          sx={{
            gap: 5,
            width: '100%',
            height: '100%',
          }}
        >
          <FormFieldStack label={'Meeting name'}>
            <CustomTextField
              placeholder={`Jane's meeting...`}
              onChange={onMeetingNameChange}
            />
          </FormFieldStack>
          <FormFieldStack label={'Meeting description'}>
            <CustomTextArea
              placeholder={'Description...'}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormFieldStack>
          <Stack sx={{ gap: 1.5 }}>
            <FormFieldStack label={'Meeting start date'}>
              <DatePicker
                onChange={(newDate) => setStartDate(newDate)}
                defaultValue={formIntialValues.startDate}
              />
            </FormFieldStack>
            <FormFieldStack label={'Meeting end date'}>
              <DatePicker
                onChange={(newDate) => setEndDate(newDate)}
                defaultValue={formIntialValues.endDate}
              />
            </FormFieldStack>
          </Stack>
          <Stack sx={{ gap: 1.5 }}>
            <FormFieldStack label={'Meeting earliest time'}>
              <TimePicker
                onChange={(newTime) => setMinTime(newTime)}
                defaultValue={formIntialValues.minTime}
              />
            </FormFieldStack>
            <FormFieldStack label={'Meeting latest time'}>
              <TimePicker
                onChange={(newTime) => setMaxTime(newTime)}
                defaultValue={formIntialValues.maxTime}
              />
            </FormFieldStack>
          </Stack>
          <Stack sx={{ flexDirection: 'row', gap: 1, width: '100%', mt: 2 }}>
            <CustomButton
              onClick={() => onClose()}
              color="secondary"
              style={{ width: '50%' }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={onCreateMeetingClicked}
              isLoading={isCreateMeetingLoading}
              disabled={!isMeetingNameValid}
              style={{ width: '50%' }}
            >
              Create
            </CustomButton>
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
  );
};

export default CreateMeetingModal;
