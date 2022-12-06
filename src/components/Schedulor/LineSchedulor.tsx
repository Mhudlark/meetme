import { Box, Stack, Typography } from '@mui/material';
import { range } from 'lodash';
import { useMemo } from 'react';

import { formatDateToFriendlyString, getDateRange } from '@/utils/date';

import type { SliderMark } from './RangeSlider';
import RangeSlider from './RangeSlider';

const formatTimeValue = (value: number) => {
  if (value < 0 || value > 24) throw new Error(`Invalid time value: ${value}`);
  if (value % 0.5 !== 0) throw new Error(`Invalid time value: ${value}`);
  return `${value - (value % 1)}:${value % 1 === 0.5 ? '30' : '00'}`;
};

export interface LineSchedulorProps {
  onChange: (thing: any) => void;
  startDate: Date;
  endDate: Date;
  minTime: number;
  maxTime: number;
  intervalSize: number;
}

export default function LineSchedulor({
  onChange,
  startDate,
  endDate,
  minTime,
  maxTime,
  intervalSize,
}: LineSchedulorProps) {
  const days = useMemo(
    () => getDateRange(startDate, endDate),
    [startDate, endDate]
  );

  const marks: SliderMark[] = useMemo(() => {
    const newMarks: SliderMark[] = range(minTime, maxTime, intervalSize).map(
      (timeNum) => {
        return {
          value: timeNum,
          label: formatTimeValue(timeNum),
        };
      }
    );

    return newMarks;
  }, []);

  return (
    <Stack sx={{ gap: 3 }}>
      {days.map((day) => (
        <Stack key={day.toISOString()} sx={{ gap: 1 }}>
          <Typography variant="h6">
            {formatDateToFriendlyString(day)}
          </Typography>
          <Box
            sx={{
              p: 0.5,
              backgroundColor: '#cfe5fd',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                px: 2,
              }}
            >
              <RangeSlider
                minRange={0}
                marks={marks}
                defaultValue={[minTime, maxTime]}
                onChange={onChange}
                ariaLabel={`${formatDateToFriendlyString(day)} range slider`}
                ariaValueFormat={formatTimeValue}
              />
            </Box>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
