import { Stack } from '@mui/material';
import { addDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';

import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import FormFieldStack from '@/components/Styled/formFieldStack';
import CustomTextArea from '@/components/TextArea';
import CustomTextField from '@/components/TextField';
import TimePicker from '@/components/TimePicker';
import { DbContext } from '@/context/dbContext';
import type { MeetingDetails } from '@/types/meeting';
import { Time24 } from '@/types/time24';
import { paths } from '@/utils/paths';
import { validateMeetingName } from '@/utils/validation';

const formIntialValues = {
  meetingName: '',
  description: '',
  startDate: new Date(),
  endDate: addDays(new Date(), 7),
  minTime: new Time24(9, 0),
  maxTime: new Time24(17, 0),
};

const Index = () => {
  const router = useRouter();
  const { createMeeting } = useContext(DbContext);

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
  const [isCreateEventLoading, setIsCreateEventLoading] = useState(false);

  const onMeetingNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetingName(event.target.value);
  };

  const onCreateEventClicked = async () => {
    if (!isMeetingNameValid) throw new Error('Meeting name is invalid');
    // if (!description) throw new Error('Description is invalid');
    if (!startDate) throw new Error('Start date is invalid');
    if (!endDate) throw new Error('End date is invalid');
    if (!minTime) throw new Error('Min time is invalid');
    if (!maxTime) throw new Error('Max time is invalid');

    const meetingDetails: MeetingDetails = {
      name: meetingName,
      description,
      startDate,
      endDate,
      minTime: minTime.valueOf(),
      maxTime: maxTime.valueOf(),
    };

    setIsCreateEventLoading(true);
    const meetingId = await createMeeting(meetingDetails);
    setIsCreateEventLoading(false);
    router.push(`${paths.meeting}/${meetingId}`);
  };

  return (
    <Stack
      sx={{
        gap: 4,
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
      <CustomButton
        onClick={onCreateEventClicked}
        disabled={!isMeetingNameValid}
        isLoading={isCreateEventLoading}
        style={{ width: 'fit-content' }}
      >
        Create Event
      </CustomButton>
    </Stack>
  );
};

export default Index;
