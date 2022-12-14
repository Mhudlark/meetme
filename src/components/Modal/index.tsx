import 'react-day-picker/dist/style.css';

import type { SxProps, Theme } from '@mui/material';
import { Box, Modal } from '@mui/material';
import type { CSSProperties, ReactNode } from 'react';
import colors from 'tailwindcss/colors';

import { customColors } from '@/styles/colors';

export interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  children?: ReactNode;
  sx?: SxProps<Theme> | CSSProperties;
}

const CustomModal = ({
  open,
  onClose,
  ariaLabelledBy,
  ariaDescribedBy,
  children,
  sx,
}: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: {
            xs: '50vw',
            sm: 'auto',
          },
          width: 'fit-content',
          maxWidth: {
            xs: '94vw',
            sm: '540px',
            md: '720px',
          },
          height: 'fit-content',
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: customColors.background.DEFAULT,
          boxShadow: 24,
          p: {
            xs: 1,
            sm: 2,
          },
          borderRadius: 1.5,
          border: '2px solid',
          borderColor: colors.gray[900],
          ...sx,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
