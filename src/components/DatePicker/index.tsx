import 'react-day-picker/dist/style.css';

import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import colors from 'tailwindcss/colors';

import { formatDateToFriendlyString } from '@/utils/date';

import Button from '../Button';

export interface DatePickerProps {
  defaultValue?: Date;
  onChange?: (newDate: Date) => void;
}

const datePickerPropsDefaultValues: DatePickerProps = {
  defaultValue: new Date(),
};

const DatePicker = ({
  defaultValue = datePickerPropsDefaultValues.defaultValue,
  onChange,
}: DatePickerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Date>(defaultValue as Date);

  const handleChange = (newDate?: Date) => {
    if (!newDate) return;
    setSelected(newDate);
    onChange?.(newDate);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        {formatDateToFriendlyString(selected)}
      </Button>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(90vw, 400px)',
            backgroundColor: colors.gray[50],
            boxShadow: 24,
            p: 4,
            borderRadius: 1.5,
            border: '2px solid',
            borderColor: colors.gray[900],
          }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleChange}
            modifiersStyles={{
              selected: {
                backgroundColor: colors.gray[900],
              },
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default DatePicker;
