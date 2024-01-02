// eslint-disable-next-line arrow-body-style
export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String;
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
