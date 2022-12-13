import { Stack, Typography } from '@mui/material';
import type { CSSProperties } from 'react';

export interface FormFieldStackProps {
  label?: string;
  sx?: CSSProperties;
  children?: React.ReactNode;
}

const FormFieldStack = ({ label, sx, children }: FormFieldStackProps) => {
  return (
    <>
      {(label || children) && (
        <Stack sx={sx}>
          {label && <Typography variant="h6">{label}</Typography>}
          {children}
        </Stack>
      )}
    </>
  );
};

export default FormFieldStack;
