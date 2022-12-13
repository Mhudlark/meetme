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
          backgroundColor: state.isFocused ? colors.gray[50] : 'transparent',
          borderColor: state.isFocused ? 'black' : '#374151',
          outline: state.isFocused ? 'none' : 'none',
          borderWidth: '2px',
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          fontFamily: 'Roboto',
          fontWeight: '400',
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
