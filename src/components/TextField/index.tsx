import type { CSSProperties, InputHTMLAttributes } from 'react';

const baseTextFieldClassName = `
  form-input
  w-full
`;

const getTextFieldClassName = (variant: 'standard' | undefined) => {
  switch (variant) {
    case 'standard':
      return `
        ${baseTextFieldClassName}
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
    default:
      return '';
  }
};

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'standard';
  sx?: CSSProperties;
}

const textFieldPropsDefaultValues: TextFieldProps = {
  variant: 'standard',
};

const TextField = ({
  variant = textFieldPropsDefaultValues.variant,
  sx,
  ...props
}: TextFieldProps) => {
  return (
    <input style={sx} className={getTextFieldClassName(variant)} {...props}>
      {props.children}
    </input>
  );
};

export default TextField;
