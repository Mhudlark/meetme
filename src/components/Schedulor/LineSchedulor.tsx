import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import type { SchedulorSelection } from '@/sharedTypes';
import { formatDateToFriendlyString, getDateRange } from '@/utils/date';

import DateSlider from '../DateSlider';

export interface LineSchedulorProps {
  selections: SchedulorSelection[];
  onChange: (selections: SchedulorSelection[]) => void;
  startDate: Date;
  endDate: Date;
  minTime: number;
  maxTime: number;
  intervalSize: number;
}

export default function LineSchedulor({
  selections,
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

  const handleChange = (day: Date, newDates: Date[]) => {
    const newSelections = selections.map((selection) => {
      if (selection.startDate.getDate() === day.getDate()) {
        const newSelection: SchedulorSelection = {
          startDate: newDates[0] as Date,
          endDate: newDates[1] as Date,
        };
        return newSelection;
      }

      return selection;
    });

    onChange(newSelections);
  };

  return (
    <Stack sx={{ gap: 3 }}>
      {days.map((day, index) => (
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
              <DateSlider
                value={[
                  selections?.[index]?.startDate as Date,
                  selections?.[index]?.endDate as Date,
                ]}
                onChange={(newTimes) => handleChange(day, newTimes)}
                minTime={minTime}
                maxTime={maxTime}
                intervalSize={intervalSize}
              />
            </Box>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
