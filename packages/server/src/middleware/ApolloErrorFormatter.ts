import { GraphQLError, GraphQLFormattedError } from "graphql";
import { EntityNotFoundError, ValidationError } from "@battleship/common/repositories/Errors.js";
import AuthenticationError from "../services/errors/AuthenticationError.js";

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
    editedError.message = originalError.message
    extensions.code = ErrorCodes.BadInput;
  } else if (originalError instanceof AuthenticationError) {
    editedError.message = originalError.message;
    extensions.code = ErrorCodes.Authentication;
    extensions.reason = originalError.cause;
  } else if (originalError instanceof ValidationError) {
    editedError.message = "Input data invalid";
    extensions.code = ErrorCodes.Validation;
    extensions.invalidProperties = {
      ...originalError.invalidProperties
    };
  }

  return {
    ...editedError,
    extensions,
  };
};

export default ApolloErrorFormatter;
