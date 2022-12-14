import Select from 'react-select';
import colors from 'tailwindcss/colors';

import { getTimeRange, Time24 } from '@/types/time24';

interface TimeOption {
  value: number;
  label: string;
}

const timeOptions = getTimeRange(new Time24(0), new Time24(24), 0.5, true).map(
  (time: Time24) => {
    return {
      value: time.valueOf(),
      label: time.toUnpaddedString(),
    } as TimeOption;
  }
);

export interface TimePickerProps {
  defaultValue?: Time24;
  onChange?: (newTime: Time24) => void;
}

const timePickerPropsDefaultValues: TimePickerProps = {
  defaultValue: new Time24(12),
};

const TimePicker = ({
  defaultValue = timePickerPropsDefaultValues.defaultValue,
  onChange,
}: TimePickerProps) => {
  const handleChange = (val: any | TimeOption) => {
    const option = val as TimeOption;
    onChange?.(new Time24(option.value));
  };

  return (
    <Select
      id="time-picker-select"
      classNamePrefix="select"
      defaultValue={timeOptions.find(
        (time) => time.value === defaultValue?.valueOf()
      )}
      isSearchable={true}
      name="time"
      options={timeOptions}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused ? colors.white : colors.zinc[50],
          borderColor: state.isFocused ? 'black' : colors.gray[700],
          boxShadow: 'none',
          outline: state.isFocused ? `2px solid ${colors.gray[900]}` : 'none',
          outlineOffset: '3px',
          borderWidth: '2px',
          '&:hover': {
            borderColor: colors.gray[700],
            backgroundColor: colors.gray[200],
          },
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          fontFamily: 'Roboto',
          fontWeight: '400',
          backgroundColor: state.isFocused ? colors.slate[200] : colors.white,
          color: state.isFocused ? colors.gray[900] : colors.gray[900],
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          fontFamily: 'Roboto',
          fontWeight: '500',
        }),
        indicatorSeparator: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused ? 'black' : '#374151',
        }),
        dropdownIndicator: (baseStyles, state) => ({
          ...baseStyles,
          color: state.isFocused ? '000000cc' : '#374151cc',
        }),
      }}
      onChange={handleChange}
    />
  );
};

export default TimePicker;
