import Slider from '@mui/material/Slider';
import { useState } from 'react';

export type SliderMark = {
  value: number;
  label: string;
};

export interface RangeSliderProps {
  minRange: number;
  marks: SliderMark[];
  defaultValue: number[];
  onChange: (value: number[]) => void;
  ariaLabel?: string;
  ariaValueFormat?: (value: number) => string;
}

export default function RangeSlider({
  minRange,
  marks,
  defaultValue,
  onChange,
  ariaLabel,
  ariaValueFormat,
}: RangeSliderProps) {
  const [currentRange, setCurrentRange] = useState<number[]>([
    marks[0]?.value as number,
    marks[marks.length - 1]?.value as number,
  ]);

  const handleChange = (
    _: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!(Array.isArray(newValue) && newValue.length >= 2)) return;

    // Current values
    const lowerCurrentValue = currentRange?.[0] as number;
    const upperCurrentValue = currentRange?.[1] as number;

    // New values
    const newValues = newValue as number[];
    const lowerNewValue = newValues?.[0] ?? lowerCurrentValue;
    const upperNewValue = newValues?.[1] ?? upperCurrentValue;

    let newRange = currentRange;
    // First thumb slider
    if (activeThumb === 0) {
      newRange = [
        Math.min(lowerNewValue, upperCurrentValue - minRange),
        upperCurrentValue,
      ];
    }
    // Second thumb slider
    else {
      newRange = [
        lowerCurrentValue,
        Math.max(upperNewValue, lowerCurrentValue + minRange),
      ];
    }

    setCurrentRange(newRange);
    onChange(newRange);
  };

  return (
    <Slider
      defaultValue={defaultValue}
      value={currentRange}
      onChange={handleChange}
      step={null}
      marks={marks}
      valueLabelDisplay="auto"
      disableSwap
      getAriaLabel={() => ariaLabel ?? 'Range slider'}
      getAriaValueText={ariaValueFormat}
      valueLabelFormat={ariaValueFormat}
      min={marks[0]?.value as number}
      max={marks[marks.length - 1]?.value as number}
    />
  );
}
