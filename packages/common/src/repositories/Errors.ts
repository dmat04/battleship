import { Error as MongooseError } from "mongoose";

export class RepositoryError extends Error {
  constructor(original: unknown) {
    super("An unknown Repository error has occured", { cause: original });
  }
}

export class EntityNotFoundError extends Error {
  constructor(
    readonly entityType: string,
    readonly entityIdentifier: string,
  ) {
    super(
      `Entity of type ${entityType} with identifier '${entityIdentifier}' wasn't found.`,
    );
  }
}

interface PropertyError {
  value: string;
  message: string;
}

type ValidationErrorParams =
  | MongooseError.ValidationError
  | { propertyName: string; error: PropertyError }[];

export class ValidationError extends Error {
  invalidProperties: {
    [property: string]: PropertyError;
  } = {};

  constructor(args: ValidationErrorParams) {
    if (args instanceof MongooseError.ValidationError) {
      super(args.message);

      Object.entries(args.errors).forEach(([prop, err]) => {
        if (err instanceof MongooseError.ValidatorError) {
          this.invalidProperties[prop] = {
            value: String(err.value),
            message: err.message,
          };
        } else {
          this.invalidProperties[prop] = {
            value: err.stringValue,
            message: "Error casting value",
          };
        }
      });
    } else {
      super(
        "Validation error on properties: " +
          args.map((p) => p.propertyName).toString(),
      );
      args.forEach((err) => {
        this.invalidProperties[err.propertyName] = err.error;
      });
    }
  }
}
