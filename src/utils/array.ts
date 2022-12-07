export const getArrElement = <T>(arr: any[] | null, index: number = 0): T => {
  if (arr === null || !Array.isArray(arr))
    throw new Error(`Parameter is not an array: ${arr}`);

  const elem = arr?.[index];

  if (!elem) throw new Error('Array element does not exist');

  return elem as T;
};
