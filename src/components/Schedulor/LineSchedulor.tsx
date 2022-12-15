import { ContentCopy } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { isSameDay } from 'date-fns';
import { useMemo } from 'react';

import { customColors } from '@/styles/colors';
import type { SchedulorSelection } from '@/types/schedulorSelection';
import { Time24 } from '@/types/time24';
import {
  formatDateToFriendlyString,
  getDateRange,
  setDateTimeWithTime24,
} from '@/utils/date';

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
      if (selection.date.getDate() === day.getDate()) {
        const newStartTime = new Time24(minTime);
        const newEndTime = checked ? new Time24(maxTime) : new Time24(minTime);

        return selection.copyWithTimes(newStartTime, newEndTime);
      }

      return selection;
    });

    onChange(newSelections);
  };

  const handleChange = (day: Date, newDates: Date[]) => {
    const newSelections = selections.map((selection) => {
      if (selection.date.getDate() === day.getDate()) {
        return selection.copyWithTimes(
          Time24.fromDate(newDates[0] as Date),
          Time24.fromDate(newDates[1] as Date)
        );
      }

      return selection;
    });

    onChange(newSelections);
  };

  const copyPreviousDaySelection = (day: Date) => {
    const newSelections = selections.map((selection, index) => {
      if (index > 0 && isSameDay(selection.date, day)) {
        const previousSelection = selections[index - 1] as SchedulorSelection;
        return previousSelection.copyWithDate(selection.date);
      }
      return selection;
    });

    onChange(newSelections);
  };

  const isDateSelected = useMemo(() => {
    return selections.map((selection) => {
      return !selection.isEmpty();
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
            <Stack
              sx={{
                flexDirection: 'row',
                gap: 2,
              }}
            >
              {index !== 0 && (
                <Button
                  variant="text"
                  onClick={() => copyPreviousDaySelection(day)}
                  endIcon={<ContentCopy />}
                  sx={{
                    color: customColors.gray[600],
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: `${customColors.gray[200]}66`,
                      color: customColors.gray[900],
                    },
                  }}
                >
                  Copy previous day
                </Button>
              )}
              <CustomSwitch
                isChecked={isDateSelected?.[index] ?? false}
                onChange={(checked) => handleToggleChange(day, checked)}
              />
            </Stack>
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
                  selections?.[index]?.getMinSelectedDateTime() ??
                    setDateTimeWithTime24(day, new Time24(minTime)),
                  selections?.[index]?.getMaxSelectedDateTime() ??
                    setDateTimeWithTime24(day, new Time24(maxTime)),
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
