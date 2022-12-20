export const clampNumber = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const add = (a: number, b: number) => a + b;
