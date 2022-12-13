import 'react-day-picker/dist/style.css';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import colors from 'tailwindcss/colors';

import { formatDateToFriendlyString } from '@/utils/date';

import CustomButton from '../Button';
import Modal from '../Modal';

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
    if (newDate) {
      setSelected(newDate);
      onChange?.(newDate);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <CustomButton onClick={() => setIsModalOpen(true)}>
        {formatDateToFriendlyString(selected)}
      </CustomButton>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ariaLabelledBy="date-picker-modal"
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
      </Modal>
    </>
  );
};

export default DatePicker;
