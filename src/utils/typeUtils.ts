// eslint-disable-next-line arrow-body-style
export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String;
};

export const isInteger = (value: unknown): value is number => {
  if (isString(value)) {
    return !Number.isNaN(Number.parseInt(value, 10));
  }

  return false;
};

// eslint-disable-next-line arrow-body-style
export const isObject = (value: unknown): value is object => {
  return typeof value === 'object';
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union or enum member: ${JSON.stringify(value)}`,
  );
};
