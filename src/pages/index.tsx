import { Stack } from '@mui/material';
import { addDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';

import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import TextArea from '@/components/TextArea';
import TextField from '@/components/TextField';
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
  const isMeetingNameValid = useMemo(
    () => validateMeetingName(meetingName),
    [meetingName]
  );

  const [description, setDescription] = useState<string>(
    formIntialValues.description
  );
  const [startDate, setStartDate] = useState<Date>(formIntialValues.startDate);
  const [endDate, setEndDate] = useState<Date>(formIntialValues.endDate);
  const [minTime, setMinTime] = useState<Time24>(formIntialValues.minTime);
  const [maxTime, setMaxTime] = useState<Time24>(formIntialValues.maxTime);

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

    const meetingId = await createMeeting(meetingDetails);
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
      <TextField placeholder={'Meeting name'} onChange={onMeetingNameChange} />
      <TextArea
        placeholder={'Description...'}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Stack sx={{ gap: 1.5 }}>
        <DatePicker
          label="Start date"
          onChange={(newDate) => setStartDate(newDate)}
          defaultValue={formIntialValues.startDate}
        />
        <DatePicker
          label="End date"
          onChange={(newDate) => setEndDate(newDate)}
          defaultValue={formIntialValues.endDate}
        />
      </Stack>
      <Stack sx={{ gap: 1.5 }}>
        <TimePicker
          label="Min time"
          onChange={(newTime) => setMinTime(newTime)}
          defaultValue={formIntialValues.minTime}
        />
        <TimePicker
          label="Max time"
          onChange={(newTime) => setMaxTime(newTime)}
          defaultValue={formIntialValues.maxTime}
        />
      </Stack>
      <Button
        onClick={onCreateEventClicked}
        disabled={!isMeetingNameValid}
        sx={{ width: 'fit-content' }}
      >
        Create Event
      </Button>
    </Stack>
  );
};

export default Index;
