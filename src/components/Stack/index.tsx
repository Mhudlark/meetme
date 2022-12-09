import type { AllHTMLAttributes, CSSProperties } from 'react';

const baseStackStyles = `
  flex
`;

const getStackClassName = (direction: 'row' | 'column' | undefined) => {
  switch (direction) {
    case 'row':
      return `
      ${baseStackStyles}
      flex-row
      `;
    case 'column':
      return `
      ${baseStackStyles}
      flex-col
      `;
    default:
      return '';
  }
};

export interface StackProps extends AllHTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  sx?: CSSProperties;
}

const StackPropsDefaultValues: StackProps = {
  direction: 'column',
};

const Stack = ({
  direction = StackPropsDefaultValues.direction,
  sx,
  ...props
}: StackProps) => {
  return (
    <div style={sx} className={getStackClassName(direction)} {...props}>
      {props.children}
    </div>
  );
};

export default Stack;
