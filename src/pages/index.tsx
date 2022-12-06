import { Stack } from '@mui/material';

import LineSchedulor from '@/components/Schedulor/LineSchedulor';

const Index = () => {
  const onChange = (thing: any) => {
    console.log(thing);
  };

  const startDate = new Date('2022-12-08');
  const endDate = new Date('2022-12-21');
  const minTime = 17;
  const maxTime = 23;
  const intervalSize = 1;

  return (
    <Stack sx={{ gap: 4 }}>
      <LineSchedulor
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        minTime={minTime}
        maxTime={maxTime}
        intervalSize={intervalSize}
      />
    </Stack>
  );
};

export default Index;
