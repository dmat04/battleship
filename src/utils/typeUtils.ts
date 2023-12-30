// eslint-disable-next-line arrow-body-style
export const isString = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String;
};

// eslint-disable-next-line arrow-body-style
export const isObject = (value: unknown): value is object => {
  return typeof value === 'object';
};
