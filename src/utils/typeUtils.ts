const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union or enum member: ${JSON.stringify(value)}`,
  );
};

export default assertNever;
