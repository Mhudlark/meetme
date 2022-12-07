import { Stack } from '@mui/material';
import { addDays, setHours } from 'date-fns';
import { range } from 'lodash';
import { useState } from 'react';

import type { SchedulorSelection } from '@/components/Schedulor/LineSchedulor';
import LineSchedulor from '@/components/Schedulor/LineSchedulor';

const Index = () => {
  const numDays = 5;
  const schedulorStartDate = new Date('2022-12-08');
  const schedulorEndDate = addDays(schedulorStartDate, numDays);
  const minTime = 17;
  const maxTime = 23;
  const intervalSize = 1;

  const [selections, setSelections] = useState<SchedulorSelection[]>(
    range(0, numDays).map((i) => {
      const day = addDays(schedulorStartDate, i);
      const startDate = setHours(day, minTime);
      const endDate = setHours(startDate, maxTime);
      const selection: SchedulorSelection = {
        startDate,
        endDate,
      };
      return selection;
    })
  );

  const onChange = (newSelections: SchedulorSelection[]) => {
    console.log(newSelections);
    setSelections(newSelections);
  };

  return (
    <Stack sx={{ gap: 4 }}>
      <LineSchedulor
        selections={selections}
        onChange={onChange}
        startDate={schedulorStartDate}
        endDate={schedulorEndDate}
        minTime={minTime}
        maxTime={maxTime}
        intervalSize={intervalSize}
      />
    </Stack>
  );
};

export default Index;
