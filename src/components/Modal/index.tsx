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
          width: 'min(90vw, 400px)',
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
