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
        <Stack sx={{ gap: 0.6, ...sx }}>
          {label && (
            <Typography variant="h4" sx={{ pl: 0.5 }}>
              {label}
            </Typography>
          )}
          {children}
        </Stack>
      )}
    </>
  );
};

export default FormFieldStack;
