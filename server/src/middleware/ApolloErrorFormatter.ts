import { GraphQLError, GraphQLFormattedError } from "graphql";
import { Error as MongooseError } from "mongoose";
import EntityNotFoundError from "../services/errors/EntityNotFoundError.js";
import AuthenticationError from "../services/errors/AuthenticationError.js";
import ValidationError, {
  objectIsErrorDetails,
} from "../services/errors/ValidationError.js";

enum ErrorCodes {
  Validation = "VALIDATION_FAILED",
  BadInput = "BAD_USER_INPUT",
  Authentication = "UNAUTHENTICATED",
}

const ApolloErrorFormatter = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  const editedError = {
    ...formattedError,
  };

  const extensions = {
    ...formattedError.extensions,
  };

  let originalError = error;
  if (error instanceof GraphQLError && error.originalError) {
    originalError = error.originalError
  }

  if (originalError instanceof EntityNotFoundError) {
    editedError.message = `No '${originalError.entityType}' with id=${originalError.entityIdentifier} found`;
    extensions.code = ErrorCodes.BadInput;
  } else if (originalError instanceof AuthenticationError) {
    editedError.message = originalError.message;
    extensions.code = ErrorCodes.Authentication;
    extensions.reason = originalError.cause;
  } else if (originalError instanceof ValidationError) {
    editedError.message = "Input data invalid";
    extensions.code = ErrorCodes.Validation;
    const { cause } = originalError;

    if (objectIsErrorDetails(cause)) {
      extensions.validationErrors = [cause];
    } else if (cause instanceof MongooseError.ValidationError) {
      extensions.validationErrors = Object.entries(cause.errors).map(
        ([path, mongErr]) => ({
          property: path,
          errorKind: mongErr.kind,
          value: JSON.stringify(mongErr.value),
          message: mongErr.message,
        }),
      );
    }
  }

  return {
    ...editedError,
    extensions,
  };
};

export default ApolloErrorFormatter;
