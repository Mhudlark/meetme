import { Box, Stack, Typography } from '@mui/material';
import { isSameDay } from 'date-fns';
import { useMemo } from 'react';

import type { SchedulorSelection } from '@/sharedTypes';
import { Time24 } from '@/types/time24';
import {
  formatDateToFriendlyString,
  getDateRange,
  setDateTimeWithTime24,
} from '@/utils/date';

import CustomButton from '../Button';
import DateSlider from '../DateSlider';
import CustomSwitch from '../Switch';

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
    () => getDateRange(startDate, endDate, true),
    [startDate, endDate]
  );

  const handleToggleChange = (day: Date, checked: boolean) => {
    const newSelections = selections.map((selection) => {
      if (selection.startDate.getDate() === day.getDate()) {
        const newStartDate = setDateTimeWithTime24(
          selection.startDate,
          new Time24(minTime)
        );
        const newEndDate = setDateTimeWithTime24(
          selection.endDate,
          checked ? new Time24(maxTime) : new Time24(minTime)
        );

        const newSelection: SchedulorSelection = {
          startDate: newStartDate,
          endDate: newEndDate,
        };
        return newSelection;
      }

      return selection;
    });

    onChange(newSelections);
  };

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

  const copyPreviousDaySelection = (day: Date) => {
    const newSelections = selections.map((selection, index) => {
      if (index > 0 && isSameDay(selection.startDate, day)) {
        const previousSelection = selections[index - 1] as SchedulorSelection;
        const newSelection: SchedulorSelection = {
          startDate: setDateTimeWithTime24(
            selection.startDate,
            new Time24(previousSelection.startDate)
          ),
          endDate: setDateTimeWithTime24(
            selection.endDate,
            new Time24(previousSelection.endDate)
          ),
        };
        return newSelection;
      }
      return selection;
    });

    onChange(newSelections);
  };

  const isDateSelected = useMemo(() => {
    return selections.map((selection) => {
      const startTime = new Time24(selection.startDate);
      const endTime = new Time24(selection.endDate);
      return !startTime.equals(endTime);
    });
  }, [selections]);

  return (
    <Stack sx={{ gap: 3 }}>
      {days.map((day, index) => (
        <Stack key={day.toISOString()} sx={{ gap: 1 }}>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h6">
              {formatDateToFriendlyString(day)}
            </Typography>
            {index !== 0 && (
              <CustomButton onClick={() => copyPreviousDaySelection(day)}>
                Copy previous day
              </CustomButton>
            )}
            <CustomSwitch
              isChecked={isDateSelected?.[index] ?? false}
              onChange={(checked) => handleToggleChange(day, checked)}
            />
          </Stack>
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
