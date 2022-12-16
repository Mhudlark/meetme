import { CircularProgress, Stack } from '@mui/material';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';

const baseButtonClassName = `
  w-fit
  py-2 px-4
  rounded-md 
  font-bold
  cursor-pointer
  transition duration-300 ease-in-out
  focus:outline-offset-4
  focus:outline-gray-900
  border-2
`;

const getButtonClassName = (
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | undefined,
  disabled?: boolean
) => {
  if (disabled) {
    return ` 
      ${baseButtonClassName}
      bg-gray-300
      text-gray-600
      border-gray-300
      cursor-auto
    `;
  }

  switch (color) {
    case 'primary':
      return `
      ${baseButtonClassName}
      bg-gray-900 hover:bg-white
      text-white hover:text-gray-900
      border-gray-900
      `;
    case 'secondary':
      return `
      ${baseButtonClassName}
      bg-white hover:bg-gray-900 
      text-gray-900 hover:text-white
      border-gray-900
      `;
    case 'error':
      return `
      ${baseButtonClassName}
      bg-red-600 hover:bg-white
      text-white hover:text-red-600
      border-red-600
      `;
    case 'warning':
      return `
      ${baseButtonClassName}
      bg-orange-600 hover:bg-white
      text-white hover:text-orange-600
      border-orange-600
      `;
    case 'success':
      return `
      ${baseButtonClassName}
      bg-green-600 hover:bg-white
      text-white hover:text-green-600
      border-green-600
      `;
    default:
      return '';
  }
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  isLoading?: boolean;
  style?: CSSProperties;
}

const buttonPropsDefaultValues: ButtonProps = {
  color: 'primary',
  isLoading: false,
};

const CustomButton = ({
  color = buttonPropsDefaultValues.color,
  disabled,
  isLoading,
  style,
  ...props
}: ButtonProps) => {
  return (
    <button
      style={style}
      type="button"
      className={getButtonClassName(color, disabled)}
      disabled={disabled}
      {...props}
    >
      {isLoading && !disabled ? (
        <Stack
          sx={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            width:
              typeof props?.children === 'string'
                ? `${props.children.length * 8.4}px`
                : '60px',
            height: '24px',
          }}
        >
          <CircularProgress size={20} sx={{ color: 'white' }} />
        </Stack>
      ) : (
        props.children
      )}
    </button>
  );
};

export default CustomButton;
