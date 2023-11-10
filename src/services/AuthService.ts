import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { add } from 'date-fns';
import config from '../utils/config';
import { GuestUser, RegisteredUser,GuestUserModel } from '../models/User';

interface AccessToken {
  token: string;
  expiresAt: Date;
}

interface LoginResult {
  username: string;
  token: AccessToken;
}

/**
 * Generates a username of the format `Guest#${num}` followed
 * where 'num' is a pseudo-random integer in the range [0, 100_000>.
 * Doesn't guarantee uniqueness in the registry.
 *
 * @returns A randomly generated username string
 */
const generateGuestUsername = (): string => {
  const randomId = Math.random() * 100_000;
  return `Guest#${Math.floor(randomId)}`;
};

/**
 * Create a temporary access token for a given username.
 *
 * @param username Username to be encoded in the access token.
 * @returns An AccessToken containing the access code and expiration timestamp.
 */
const encodeToken = (username: string): AccessToken => {
  // record the expiration timestamp
  const expiresAt = add(Date.now(), { seconds: config.GUEST_LIFETIME_SECONDS });

  // create the 
  const token = jwt.sign(
    { username },
    config.JWT_SECRET,
    { 
      expiresIn: config.GUEST_LIFETIME_SECONDS,
    },
  );

  return {
    token,
    expiresAt
  };
};

/**
 * Decode an access token.
 *
 * @param token The token to be decoded.
 * @returns Decoded username, or throws an error if the 
 *          token is invalid or already expired
 */
const decodeToken = (token: string): string => {
  const payload = jwt.verify(token, config.JWT_SECRET);
  if (typeof payload === 'object' && 'username' in payload) {
    return payload.username;
  }

  // shouldn't really reach this
  throw new Error('Unexpected error while verifying access token');
};

/**
 * Schedules the deletion of a guest user.
 *
 * @param username Username of the guest to be deleted
 */
const createUserExiprationJob = (username: string): void => {
  setTimeout(() => {
    GuestUserModel.deleteOne({ username });
  }, config.GUEST_LIFETIME_SECONDS * 1000);
};

/**
 * Create a guest user and an accompanying access token
 *
 * @param username Username for the guest, if none is provided a random one is generated.
 *                 If a username is specified and it is already taken, a UsernameTakenError
 *                 is thrown.
 * @returns The user data, including: username, expiration timestamp and access token.
 */
const createGuestUserAndToken = async (username?: string): Promise<LoginResult> => {
  let name;

  if (username) {
    // If a username has been requested, check that it's available
    if (await GuestUserModel.usernameExists(username)) {
      throw new UsernameTakenError(username);
    }

    name = username;
  } else {
    // If no username was requested, create a random one...
    name = generateGuestUsername();

    // ...and also make sure it's available
    while (await GuestUserModel.usernameExists(name)) {
      name = generateGuestUsername();
    }
  }

  // Create a user token
  const token = encodeToken(name)
  // Schedule guest deletion
  createUserExiprationJob(name);
  // Create a GuestUser document ...
  const guestUser = new GuestUserModel({
    username: name,
    expiresAt: token.expiresAt
  })

  // ... and save it
  await guestUser.save();

  return { 
    username: guestUser.username,
    token
  };
};

/**
 * Get the an existing Guest user.
 *
 * @param username The name of the guest to be retrieved.
 * @returns A Promise resolving The user data, or null or undefined if 
 *          no user with the given username exists.
 */
// eslint-disable-next-line arrow-body-style
const getGuestUser = async (username: string): Promise<GuestUser | null | undefined> => {
  return await GuestUserModel.findOne({ username });
};

/**
 * Decode user data from an access token.
 *
 * @param token The token to be decoded
 * @returns An object containig the username and expiration timestamp, or
 *          throws an error if the token is invalid or already expired
 */
const getUserFromToken = async (token: string): Promise<GuestUser> => {
  try {
    const username = decodeToken(token);
    const user = await GuestUserModel.findOne({ username });
    if (user) {
      return {
        username: user.username,
        expiresAt: user.expiresAt
      }
    } else {
      throw new UserNotFoundError(username);
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AccesTokenError('has expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new AccesTokenError('is invalid')
    } else {
      throw new AuthServiceError('An unexpected error has occured')
    }
  }
}

/**
 * Custom Error to indicate an unexpected authentication 
 * service error
 */
export class AuthServiceError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}

/**
 * Custom Error to indicate that a requested username is taken
 */
export class UsernameTakenError extends Error {
  constructor(readonly username: string) {
    super(`Username ${username} is already taken`);
  }
}

/**
 * Custom Error to indicate that a requested User hasn't been found
 */
export class UserNotFoundError extends Error {
  constructor(readonly username: string) {
    super(`User '${username}' couldn't be found`);
  }
}

/**
 * Custom Error to indicate that an access token is invalid
 * or expired
 */
export class AccesTokenError extends Error {
  constructor(readonly cause: 'has expired' | 'is invalid') {
    super(`The provided access token ${cause}`);
  }
}

export default {
  createGuestUserAndToken,
  getGuestUser,
  getUserFromToken,
};
