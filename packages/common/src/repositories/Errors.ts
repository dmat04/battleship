import { Error as MongooseError } from "mongoose";

export class RepositoryError extends Error {
  constructor(original: unknown) {
    super("An unknown Repository error has occured", { cause: original });
  }
};

export class EntityNotFoundError extends Error {
  constructor(
    readonly entityType: string,
    readonly entityIdentifier: string,
  ) {
    super(
      `Entity of type ${entityType} with identifier '${entityIdentifier}' wasn't found.`,
    );
  }
};

export class ValidationError extends Error {
  invalidProperties: {
    [property: string]: {
      value: string;
      message: string;
    };
  } = {};

  constructor(mongooseError: MongooseError.ValidationError) {
    super();

    Object.entries(mongooseError.errors).forEach(([prop, err]) => {
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
  }
};
