import { range } from 'lodash';
import { useMemo } from 'react';

import { Time24 } from '@/types/time24';
import {
  formatDateToFriendlyString,
  setDateTimeWithTime24,
} from '@/utils/date';

import type { SliderMark } from '../RangeSlider';
import RangeSlider from '../RangeSlider';

const formatTimeValue = (value: number) => {
  const time24 = new Time24(value);
  return time24.toString();
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
    const newMarks: SliderMark[] = range(
      minTime,
      maxTime + intervalSize,
      intervalSize
    ).map((timeNum) => {
      return {
        value: timeNum,
        label: formatTimeValue(timeNum),
      };
    });

    return newMarks;
  }, []);

  const sliderValue = useMemo(() => {
    return value.map((date) => new Time24(date).valueOf());
  }, [value]);

  const handleChange = (newTimeVals: number[]) => {
    if (newTimeVals.length < 2)
      throw new Error('Range slider on change value must have 2 elements');

    const startDate = new Date(value[0]!);
    const startTimeNum = newTimeVals[0]!;
    const newStartDate = setDateTimeWithTime24(
      startDate,
      new Time24(startTimeNum)
    );

    const endDate = new Date(value[1]!);
    const endTimeNum = newTimeVals[1]!;
    const newEndDate = setDateTimeWithTime24(endDate, new Time24(endTimeNum));

    onChange([newStartDate, newEndDate]);
  };

  if (value.length < 2)
    throw new Error('Date slider value must have 2 elements');

  return (
    <>
      {value && value.length > 0 && (
        <RangeSlider
          minRange={0}
          marks={marks}
          value={sliderValue}
          onChange={handleChange}
          ariaLabel={`${formatDateToFriendlyString(value[0]!)} range slider`}
          ariaValueFormat={formatTimeValue}
        />
      )}
    </>
  );
}
