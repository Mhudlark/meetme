import type { CSSProperties, InputHTMLAttributes } from 'react';

const baseTextFieldClassName = `
  form-input
  w-full
  transition duration-200 ease-in-out
  ease-in-out
  m-0
  focus:outline-none
`;

const getTextFieldClassName = (variant: 'standard' | 'sexy' | undefined) => {
  switch (variant) {
    case 'standard':
      return `
        ${baseTextFieldClassName}
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700 hover:text-gray-900 focus:text-gray-900
        bg-white bg-clip-padding hover:bg-gray-50 focus:bg-gray-100
        border border-solid 
        border-gray-300 hover:border-gray-700 focus:border-gray-900
        rounded
      `;
    case 'sexy':
      return `
        ${baseTextFieldClassName}
        px-3
        py-3
        text-base
        font-body
        font-medium
        text-gray-900 hover:text-black focus:text-black
        bg-transparent bg-clip-padding hover:bg-gray-100 focus:bg-white
        border-2 border-solid 
        border-gray-700 focus:border-black
        rounded-lg        
      `;
    default:
      return '';
  }
};

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'standard' | 'sexy';
  sx?: CSSProperties;
}

const textFieldPropsDefaultValues: TextFieldProps = {
  variant: 'sexy',
};

const CustomTextField = ({
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

export default CustomTextField;
