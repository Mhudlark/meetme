import Slider from '@mui/material/Slider';

export type SliderMark = {
  value: number;
  label: string;
};

export interface RangeSliderProps {
  minRange: number;
  marks: SliderMark[];
  value: number[];
  onChange: (value: number[]) => void;
  ariaLabel?: string;
  ariaValueFormat?: (value: number) => string;
}

export default function RangeSlider({
  minRange,
  marks,
  value,
  onChange,
  ariaLabel,
  ariaValueFormat,
}: RangeSliderProps) {
  const handleChange = (
    _: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!(Array.isArray(newValue) && newValue.length >= 2)) return;

    // Current values
    const lowerCurrentValue = value?.[0]!;
    const upperCurrentValue = value?.[1]!;

    // New values
    const newValues = newValue as number[];
    const lowerNewValue = newValues?.[0] ?? lowerCurrentValue;
    const upperNewValue = newValues?.[1] ?? upperCurrentValue;

    let newRange = [...value];
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

    onChange(newRange);
  };

  if (value.length < 2)
    throw new Error('Range slider value must have 2 elements');

  if (marks.length === 0)
    throw new Error('Range slider marks must have 2 elements');

  return (
    <Slider
      value={value}
      onChange={handleChange}
      step={null}
      marks={marks}
      valueLabelDisplay="auto"
      disableSwap
      getAriaLabel={() => ariaLabel ?? 'Range slider'}
      getAriaValueText={ariaValueFormat}
      valueLabelFormat={ariaValueFormat}
      min={marks[0]?.value!}
      max={marks[marks.length - 1]?.value!}
    />
  );
}
