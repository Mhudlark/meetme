import { ContentCopy } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { isSameDay } from 'date-fns';
import { useMemo } from 'react';

import { customColors } from '@/styles/colors';
import type { SchedulorSelection } from '@/types/schedulorSelection';
import type { Time24 } from '@/types/time24';
import { formatDateToFriendlyString, getDateRange } from '@/utils/date';

import AvailabilityPicker from '../AvailabilityPicker';
import CustomSwitch from '../Switch';

export interface GridSchedulorProps {
  selections: SchedulorSelection[];
  onChange: (selections: SchedulorSelection[]) => void;
  startDate: Date;
  endDate: Date;
  minTime: Time24;
  maxTime: Time24;
  intervalSize: number;
}

export default function GridSchedulor({
  selections,
  onChange,
  startDate,
  endDate,
  minTime,
  maxTime,
  intervalSize,
}: GridSchedulorProps) {
  const days = useMemo(
    () => getDateRange(startDate, endDate, true),
    [startDate, endDate]
  );

  const handleToggleChange = (day: Date, checked: boolean) => {
    const newSelections = selections.map((selection) => {
      if (selection.date.getDate() === day.getDate()) {
        return checked
          ? selection.copyWithTimes(minTime, maxTime)
          : selection.copyAsEmpty();
      }

      return selection;
    });

    onChange(newSelections);
  };

  const handleChange = (day: Date, newSelection: SchedulorSelection) => {
    const newSelections = selections.map((selection) => {
      if (selection.date.getDate() === day.getDate()) return newSelection;
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
          <AvailabilityPicker
            onChange={(newDates) => handleChange(day, newDates)}
            selection={selections?.[index] as SchedulorSelection}
            minTime={minTime}
            maxTime={maxTime}
            intervalSize={intervalSize}
          />
        </Stack>
      ))}
    </Stack>
  );
}
