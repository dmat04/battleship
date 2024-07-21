import { GraphQLFormattedError } from "graphql";
import { Error as MongooseError } from "mongoose";
import EntityNotFoundError from "../services/errors/EntityNotFoundError";
import AuthenticationError from "../services/errors/AuthenticationError";
import ValidationError, {
  objectIsErrorDetails,
} from "../services/errors/ValidationError";

enum ErrorCodes {
  Validation = "VALIDATION_FAILED",
  BadInput = "BAD_USER_INPUT",
  Authentication = "UNAUTHENTICATED",
}

const ApolloErrorFormatter = (
  formattedError: GraphQLFormattedError,
  error: any,
): GraphQLFormattedError => {
  const editedError = {
    ...formattedError,
  };

  const extensions = {
    ...formattedError.extensions,
  };

  const originalError = error?.originalError;

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
          value: mongErr.value,
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
