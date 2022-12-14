import { Switch } from '@mui/material';

import { customColors } from '@/styles/colors';

const switchStyle = {
  borderRadius: 2,
  // Controls default (unchecked) color for the thumb
  '.MuiSwitch-thumb': {
    color: customColors.gray[50],
    border: `1px solid ${customColors.gray[900]}`,
  },
  // Controls default (unchecked) color for the track
  '.MuiSwitch-track': {
    backgroundColor: customColors.gray[500],
    opacity: 1,
  },
  // Controls checked color for the thumb
  '.MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    color: customColors.gray[900],
  },
  // Controls checked color for the track
  '.MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: customColors.gray[50],
    opacity: 1,
    border: `1px solid ${customColors.gray[900]}`,
  },
};

export interface SwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomSwitch = ({ isChecked, onChange }: SwitchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <Switch
      checked={isChecked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'toggle' }}
      sx={switchStyle}
    />
  );
};

export default CustomSwitch;
