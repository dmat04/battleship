export const isObject = (value: unknown): value is object => {
  return typeof value === 'object';
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String;
};

export const isInteger = (value: unknown): value is number => {
  return typeof value === 'number' || value instanceof Number;
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union or enum member: ${JSON.stringify(value)}`,
  );
};
