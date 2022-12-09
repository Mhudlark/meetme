import { TextField } from '@mui/material';
import type { CSSProperties } from 'react';

import { Time24 } from '@/types/time24';

export interface TimePickerProps {
  label: string;
  defaultValue?: Time24;
  sx?: CSSProperties;
  onChange?: (newTime: Time24) => void;
}

const timePickerPropsDefaultValues: TimePickerProps = {
  label: 'Time',
  defaultValue: new Time24(12),
};

const TimePicker = ({
  label = timePickerPropsDefaultValues.label,
  defaultValue = timePickerPropsDefaultValues.defaultValue,
  sx,
  onChange,
}: TimePickerProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = event.target.value;
    const time = new Time24(timeStr);
    onChange?.(time);
  };

  return (
    <TextField
      id="time"
      label={label}
      type="time"
      defaultValue={defaultValue?.toString()}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step: 1800, // 30 min
      }}
      sx={{ width: 150, ...sx }}
      onChange={handleChange}
    />
  );
};

export default TimePicker;
