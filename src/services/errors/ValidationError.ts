import { Error as MongooseError } from 'mongoose';

class ValidationError extends Error {
  constructor(cause: string | MongooseError.ValidationError) {
    if (typeof cause === 'string') {
      super(cause);
    } else {
      super(cause.errors.username.message);
    }
  }
}

export default ValidationError;
