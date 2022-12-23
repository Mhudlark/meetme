import Select from 'react-select';

import { customColors } from '@/styles/colors';

type Option = {
  value: number;
  label: string;
};

const selectOptions: Option[] = [3, 5, 10].map((value: number) => {
  return {
    value,
    label: value.toString(),
  };
});

export interface NumStandoutsSelectProps {
  onChange?: (newValue: number) => void;
}

const NumStandoutsSelect = ({ onChange }: NumStandoutsSelectProps) => {
  const handleChange = (val: any | Option) => {
    const option = val as Option;
    onChange?.(option.value);
  };

  return (
    <Select
      id="num-standouts-select"
      classNamePrefix="select"
      defaultValue={selectOptions[0]}
      isSearchable={false}
      name="num standouts"
      options={selectOptions}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused
            ? customColors.white
            : customColors.zinc[50],
          borderColor: state.isFocused ? 'black' : customColors.gray[700],
          boxShadow: 'none',
          outline: state.isFocused
            ? `2px solid ${customColors.gray[900]}`
            : 'none',
          outlineOffset: '3px',
          borderWidth: '2px',
          '&:hover': {
            borderColor: customColors.gray[700],
            backgroundColor: customColors.gray[200],
          },
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          fontFamily: 'Roboto',
          fontWeight: '400',
          backgroundColor: state.isFocused
            ? customColors.slate[200]
            : customColors.white,
          color: state.isFocused
            ? customColors.gray[900]
            : customColors.gray[900],
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

export default NumStandoutsSelect;
