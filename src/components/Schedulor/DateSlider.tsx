import { getHours, getMinutes } from 'date-fns';
import { range } from 'lodash';
import { useMemo } from 'react';

import {
  formatDateToFriendlyString,
  setDateTimeWithBase24Number,
} from '@/utils/date';

import type { SliderMark } from './RangeSlider';
import RangeSlider from './RangeSlider';

export interface SchedulorSelection {
  startDate: Date;
  endDate: Date;
}

const formatTimeValue = (value: number) => {
  if (value < 0 || value > 24) throw new Error(`Invalid time value: ${value}`);
  if (value % 0.5 !== 0) throw new Error(`Invalid time value: ${value}`);
  return `${value - (value % 1)}:${value % 1 === 0.5 ? '30' : '00'}`;
};

export interface DateSliderProps {
  value: Date[];
  onChange: (newValue: Date[]) => void;
  minTime: number;
  maxTime: number;
  intervalSize: number;
}

export default function DateSlider({
  value,
  onChange,
  minTime,
  maxTime,
  intervalSize,
}: DateSliderProps) {
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

  const sliderValue = useMemo(() => {
    return [
      getHours(value[0] as Date) + getMinutes(value[0] as Date) / 60,
      getHours(value[1] as Date) + getMinutes(value[1] as Date) / 60,
    ];
  }, [value]);

  const handleChange = (newTimeVals: number[]) => {
    const startDate = new Date(value[0] as Date);
    const startTimeNum = newTimeVals[0] as number;
    const newStartDate = setDateTimeWithBase24Number(startDate, startTimeNum);

    const endDate = new Date(value[1] as Date);
    const endTimeNum = newTimeVals[1] as number;
    const newEndDate = setDateTimeWithBase24Number(endDate, endTimeNum);

    onChange([newStartDate, newEndDate]);
  };

  return (
    <RangeSlider
      minRange={0}
      marks={marks}
      value={sliderValue}
      onChange={handleChange}
      ariaLabel={`${formatDateToFriendlyString(value[0] as Date)} range slider`}
      ariaValueFormat={formatTimeValue}
    />
  );
}
