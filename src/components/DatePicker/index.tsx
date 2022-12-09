import { TextField } from '@mui/material';
import { format } from 'date-fns';
import type { CSSProperties } from 'react';

export interface DatePickerProps {
  label: string;
  defaultValue?: Date;
  sx?: CSSProperties;
  onChange?: (newDate: Date) => void;
}

const datePickerPropsDefaultValues: DatePickerProps = {
  label: 'Time',
  defaultValue: new Date(),
};

const DatePicker = ({
  label = datePickerPropsDefaultValues.label,
  defaultValue = datePickerPropsDefaultValues.defaultValue,
  sx,
  onChange,
}: DatePickerProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = event.target.value;
    const date = new Date(dateStr);
    onChange?.(date);
  };

  return (
    <TextField
      id="date"
      label={label}
      type="date"
      defaultValue={format(defaultValue ?? new Date(), 'yyyy-MM-dd')}
      InputLabelProps={{
        shrink: true,
      }}
      sx={{ width: 220, ...sx }}
      onChange={handleChange}
    />
  );
};

export default DatePicker;
