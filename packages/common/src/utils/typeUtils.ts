import { GuestUser, User } from "../entities/UserDbModels.js";
import { UserKind } from "../types/__generated__/types.generated.js";

export const isObject = (value: unknown): value is object => {
  return typeof value === "object";
};

export const isString = (value: unknown): value is string => {
  return typeof value === "string" || value instanceof String;
};

export const isInteger = (value: unknown): value is number => {
  return typeof value === "number" || value instanceof Number;
};

export const isParsableAsInt = (value: unknown): boolean => {
  if (isString(value)) {
    return !isNaN(parseInt(value));
  }

  return isInteger(value);
};

export const isGuestUser = (user: User): user is GuestUser => {
  return (
    user.kind === UserKind.GuestUser &&
    "expiresAt" in user &&
    user.expiresAt instanceof Date
  );
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union or enum member: ${JSON.stringify(value)}`,
  );
};
