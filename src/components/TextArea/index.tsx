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
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition duration-300 ease-in-out
        ease-in-out
        m-0
        focus:text-gray-900 focus:bg-gray-100 focus:border-gray-900 focus:outline-none
      `;
    case 'sexy':
      return `
        ${baseTextAreaClassName}
        px-3
        py-3
        text-base
        font-body
        font-medium
        text-gray-900
        bg-transparent bg-clip-padding
        border-2 border-solid border-gray-700
        rounded-lg
        transition duration-200 ease-in-out
        ease-in-out
        m-0
        focus:text-black focus:bg-white focus:border-black focus:outline-none
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

const TextArea = ({
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

export default TextArea;
