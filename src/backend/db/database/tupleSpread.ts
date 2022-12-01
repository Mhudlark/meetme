export const testWithParams = (a: string, b: string, c: number) => {
  console.log(a, b, c);
};

export const parent = () => {
  const tuple: [string, string, number] = ['a', 'b', 1];
  testWithParams(...tuple);
};
