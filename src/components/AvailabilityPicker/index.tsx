import { range } from 'lodash';
import { useMemo } from 'react';

import type { SchedulorSelection } from '@/types/schedulorSelection';
import { Time24 } from '@/types/time24';

import type { SliderMark } from '../RangeSlider';

const formatTimeValue = (value: number) => {
  const time24 = new Time24(value);
  return time24.toString();
};

export interface AvailabilityPickerProps {
  minTime: Time24;
  maxTime: Time24;
  intervalSize: number;
  selection: SchedulorSelection;
  onChange: (newSelection: SchedulorSelection) => void;
}

const AvailabilityPicker = ({
  minTime,
  maxTime,
  intervalSize,
  selection,
  onChange,
}: AvailabilityPickerProps) => {
  const marks: SliderMark[] = useMemo(() => {
    const newMarks: SliderMark[] = range(
      minTime.valueOf(),
      maxTime.valueOf(),
      intervalSize
    ).map((timeNum) => {
      return {
        value: timeNum,
        label: formatTimeValue(timeNum),
      };
    });

    return newMarks;
  }, [minTime, maxTime, intervalSize]);

  const isEachIntervalSelected = useMemo(() => {
    return selection
      .getSelectedIntervals(minTime, maxTime)
      .map((interval) => interval.selected);
  }, [selection]);

  const handleIntervalClicked = (
    intervalStartNum: number,
    intervalIndex: number
  ) => {
    const isCurrentlySelected =
      isEachIntervalSelected?.[intervalIndex] ?? false;

    const clickedSelectionStartTime = new Time24(intervalStartNum);
    const clickedSelectionEndTime = new Time24(intervalStartNum + intervalSize);

    const selectionCopy = selection.copy();

    if (isCurrentlySelected)
      selectionCopy.removeSelectionRange(
        clickedSelectionStartTime,
        clickedSelectionEndTime
      );
    else
      selectionCopy.addSelectionRange(
        clickedSelectionStartTime,
        clickedSelectionEndTime
      );

    onChange(selectionCopy);
  };

  return (
    <div
      id="availability picker container"
      className="
      grid grid-cols-auto-fill-64
      justify-start
      gap-1
      "
    >
      {marks.map((mark, index) => (
        <div
          key={mark.value}
          className={`
            flex
            justify-center        
            ${isEachIntervalSelected?.[index] ? 'bg-gray-900' : 'bg-gray-200'}
            ${isEachIntervalSelected?.[index] ? 'text-white' : 'text-gray-900'} 
            select-none
            rounded-md
            py-1
            px-2
          `}
          onClick={() => handleIntervalClicked(mark.value, index)}
        >
          {mark.label}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityPicker;
