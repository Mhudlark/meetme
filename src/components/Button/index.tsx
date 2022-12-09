import type { ButtonHTMLAttributes, CSSProperties } from 'react';

const baseButtonClassName = `
  w-fit
  py-2 px-4
  rounded-full  
  font-bold
  cursor-pointer
  transition duration-300 ease-in-out
`;

const getButtonClassName = (
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | undefined,
  disabled?: boolean
) => {
  if (disabled) {
    return ` 
      ${baseButtonClassName}
      bg-gray-300
      text-gray-700
      border border-gray-300
      cursor-auto
    `;
  }

  switch (color) {
    case 'primary':
      return `
      ${baseButtonClassName}
      bg-gray-900 hover:bg-gray-100 
      text-gray-100 hover:text-gray-900
      border border-transparent hover:border-gray-900
      `;
    case 'secondary':
      return `
      ${baseButtonClassName}
      bg-gray-100 hover:bg-gray-900 
      text-gray-900 hover:text-gray-100
      border border-transparent hover:border-gray-100
      `;
    case 'error':
      return `
      ${baseButtonClassName}
      bg-red-600 hover:bg-red-100
      text-gray-100 hover:text-red-600
      border border-transparent hover:border-red-600
      `;
    case 'warning':
      return `
      ${baseButtonClassName}
      bg-orange-600 hover:bg-orange-100
      text-gray-100 hover:text-orange-600
      border border-transparent hover:border-orange-600
      `;
    case 'success':
      return `
      ${baseButtonClassName}
      bg-green-600 hover:bg-green-100
      text-green-100 hover:text-green-600
      border border-transparent hover:border-green-600
      `;
    default:
      return '';
  }
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  sx?: CSSProperties;
}

const buttonPropsDefaultValues: ButtonProps = {
  color: 'primary',
};

const Button = ({
  color = buttonPropsDefaultValues.color,
  disabled,
  sx,
  ...props
}: ButtonProps) => {
  return (
    <button
      style={sx}
      type="button"
      className={getButtonClassName(color, disabled)}
      disabled={disabled}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;