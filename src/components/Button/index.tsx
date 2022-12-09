import type { ButtonHTMLAttributes, CSSProperties } from 'react';

const baseButtonClassName = `
  font-bold
  py-2 px-4
  rounded-full
  transition duration-300 ease-in-out
`;

const getButtonClassName = (color: 'primary' | 'secondary' | undefined) => {
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
    default:
      return '';
  }
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary';
  sx?: CSSProperties;
}

const buttonPropsDefaultValues: ButtonProps = {
  color: 'primary',
};

const Button = ({
  color = buttonPropsDefaultValues.color,
  sx,
  ...props
}: ButtonProps) => {
  return (
    <button
      style={sx}
      type="button"
      className={getButtonClassName(color)}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
