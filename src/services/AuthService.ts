import jwt from 'jsonwebtoken';
import { add } from 'date-fns';
import config from '../utils/config';

/**
 * Interface to define user data to be decoded/encoded to/from
 * jwt tokens
 */
interface GuestUserData {
  username: string,
  expiresAt: Date,
}

export interface GuestUserWithToken extends GuestUserData {
  accessToken: string,
}

/**
 * Custom Error to indicate that a requested username is taken
 */
export class UsernameTakenError extends Error {
  constructor(readonly username: string) {
    super(`Username ${username} is already taken`);
  }
}

// Registry of unexipred guest users
const registeredGuests = new Map<string, GuestUserData>();

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
 * Sign user data using jsonwebtoken. An expiration filed is added to the
 * provided username and then the object is encoded.
 *
 * @param username The username to be encoded.
 * @returns An object containing the username, expiration time and the access token
 */
const encodeGuestToken = (username: string): GuestUserWithToken => {
  // record the expiration timestamp
  const expiresAt = add(Date.now(), { seconds: config.GUEST_LIFETIME_SECONDS });

  // sign the username and expiration timestamp using jwt
  const accessToken = jwt.sign(
    {
      username,
      expiresAt,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.GUEST_LIFETIME_SECONDS,
    },
  );

  return {
    username,
    expiresAt,
    accessToken,
  };
};

/**
 * Decode user data from an access token.
 *
 * @param token The token to be decoded
 * @returns An object containig the username and expiration timestamp, or
 *          throws an error if the token is invalid or already expired
 */
const decodeGuestToken = (token: string): GuestUserData => {
  const payload = jwt.verify(token, config.JWT_SECRET);
  if (typeof payload === 'object') {
    if ('username' in payload && 'expiresAt' in payload) {
      return {
        username: payload.username,
        expiresAt: payload.expiresAt,
      };
    }
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
    registeredGuests.delete(username);
  }, config.GUEST_LIFETIME_SECONDS * 1000);
};

// TODO: also check for existing registered user's usernames
const usernameExists = (username: string): boolean => registeredGuests.has(username);

/**
 * Register the username in the guest user registry.
 *
 * @param username The guest users username
 * @param expiresAt Guest expiration timestamp
 */
const registerName = (username: string, expiresAt: Date): void => {
  registeredGuests.set(username, { username, expiresAt });
};

/**
 * Create a guest user.
 *
 * @param username Username for the guest, if none is provided a random one is generated.
 *                 If a username is specified and it is already taken, a UsernameTakenError
 *                 is thrown.
 * @returns The user data, including: username, expiration timestamp and access token.
 */
const createGuestUser = (username?: string): GuestUserWithToken => {
  let name;

  if (username) {
    // If a username has been requested, check that it's available
    if (usernameExists(username)) {
      throw new UsernameTakenError(username);
    }

    name = username;
  } else {
    // If no username was requested, create a random one...
    name = generateGuestUsername();

    // ...and also make sure it's available
    while (usernameExists(name)) {
      name = generateGuestUsername();
    }
  }

  // Create a user token
  const userAndToken = encodeGuestToken(name);
  // Schedule guest deletion
  createUserExiprationJob(userAndToken.username);
  // Register the username
  registerName(name, userAndToken.expiresAt);

  return userAndToken;
};

/**
 * Get the guest user object.
 *
 * @param username The name of the guest to be retrieved
 * @returns The user data, or undefined if no user with the given username exists
 */
// eslint-disable-next-line arrow-body-style
const getGuestUser = (username: string): GuestUserData | undefined => {
  return registeredGuests.get(username);
};

/**
 * Decode user data from an access token.
 *
 * @param token The token to be decoded
 * @returns An object containig the username and expiration timestamp, or
 *          throws an error if the token is invalid or already expired
 */
const getUserFromToken = (token: string): GuestUserData => decodeGuestToken(token);

export default {
  createGuestUser,
  getGuestUser,
  getUserFromToken,
};
