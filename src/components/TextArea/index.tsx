import { TextareaAutosize } from '@mui/material';
import type { CSSProperties } from 'react';

const baseTextAreaClassName = `
  form-input
  w-full
`;

const getTextAreaClassName = (variant: 'standard' | 'sexy' | undefined) => {
  switch (variant) {
    case 'standard':
      return `
        ${baseTextAreaClassName}
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700 hover:text-gray-900 focus:text-gray-900
        bg-white hover:bg-gray-50 focus:bg-gray-100
        bg-clip-padding
        border border-solid 
        border-gray-300 hover:border-gray-700 focus:border-gray-900
        rounded
        transition duration-300 ease-in-out
        ease-in-out
        m-0
        focus:outline-none
      `;
    case 'sexy':
      return `
        ${baseTextAreaClassName}
        px-3
        py-3
        text-base
        font-body
        font-medium
        text-gray-900 hover:text-black focus:text-black
        bg-transparent hover:bg-gray-100 focus:bg-white
        bg-clip-padding
        border-2 border-solid
        border-gray-700 focus:border-black
        rounded-lg
        transition duration-200 ease-in-out
        ease-in-out
        m-0
        focus:outline-none
      `;
    default:
      return '';
  }
};

export interface TextAreaProps {
  variant?: 'standard' | 'sexy';
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sx?: CSSProperties;
}

const textAreaPropsDefaultValues: TextAreaProps = {
  placeholder: '',
  variant: 'sexy',
};

const CustomTextArea = ({
  variant = textAreaPropsDefaultValues.variant,
  placeholder,
  onChange,
  sx,
}: TextAreaProps) => {
  return (
    <TextareaAutosize
      style={sx}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e)}
      minRows={3}
      className={getTextAreaClassName(variant)}
    />
  );
};

export default CustomTextArea;
