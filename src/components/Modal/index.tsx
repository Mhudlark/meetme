import 'react-day-picker/dist/style.css';

import { Box, Modal } from '@mui/material';
import type { ReactNode } from 'react';
import colors from 'tailwindcss/colors';

import { customColors } from '@/styles/colors';

export interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  children?: ReactNode;
}

const CustomModal = ({
  open,
  onClose,
  ariaLabelledBy,
  ariaDescribedBy,
  children,
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
          width: {
            xs: 'min(92vw, 400px)',
            sm: 'min(92vw, 540px)',
            md: 'min(92vw, 720px)',
          },
          height: {
            xs: 'min(fit-content, 600px)',
            md: 'min(fit-content, 800px)',
            lg: 'min(fit-content, 1000px)',
          },
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: customColors.roseGray[50],
          boxShadow: 24,
          p: 4,
          borderRadius: 1.5,
          border: '2px solid',
          borderColor: colors.gray[900],
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
