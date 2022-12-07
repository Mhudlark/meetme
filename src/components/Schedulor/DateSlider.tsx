import { range } from 'lodash';
import { useMemo } from 'react';

import { Time24 } from '@/types/time24';
import {
  formatDateToFriendlyString,
  setDateTimeWithTime24,
} from '@/utils/date';

import type { SliderMark } from './RangeSlider';
import RangeSlider from './RangeSlider';

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
    return value.map((date) => new Time24(date).valueOf());
  }, [value]);

  const handleChange = (newTimeVals: number[]) => {
    const startDate = new Date(value[0] as Date);
    const startTimeNum = newTimeVals[0] as number;
    const newStartDate = setDateTimeWithTime24(
      startDate,
      new Time24(startTimeNum)
    );

    const endDate = new Date(value[1] as Date);
    const endTimeNum = newTimeVals[1] as number;
    const newEndDate = setDateTimeWithTime24(endDate, new Time24(endTimeNum));

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
