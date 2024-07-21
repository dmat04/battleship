import { Error as MongooseError } from "mongoose";

export interface ErrorDetails {
  property: string;
  errorKind: "unique" | "gameInput";
  value: string;
  message: string;
}

export const objectIsErrorDetails = (object: any): object is ErrorDetails =>
  typeof object === "object" &&
  "property" in object &&
  "errorKind" in object &&
  "value" in object &&
  "message" in object;

class ValidationError extends Error {
  cause: ErrorDetails | MongooseError.ValidationError;

  constructor(cause: ErrorDetails | MongooseError.ValidationError) {
    if (objectIsErrorDetails(cause)) {
      super(cause.message);
    } else {
      super(cause.errors.username.message);
    }

    this.cause = cause;
  }
}

export default ValidationError;
