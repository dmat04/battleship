import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { Error as MongooseError } from 'mongoose';
import config from '../utils/config';
import { GuestUser, GuestUserModel, RegisteredUserModel } from '../models/User';
import ValidationError from './errors/ValidationError';
import EntityNotFoundError from './errors/EntityNotFoundError';
import AuthenticationError from './errors/AuthenticationError';

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

  // create the token with an expiration claim
  const token = jwt.sign(
    { username },
    config.JWT_SECRET,
    {
      expiresIn: config.GUEST_LIFETIME_SECONDS,
    },
  );

  return {
    token,
    expiresAt,
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
      throw new ValidationError(`Username ${username} is already taken`);
    }

    name = username;
  } else {
    // If no username was requested, create a random one...
    name = generateGuestUsername();

    // ...and also make sure it's available
    // eslint-disable-next-line no-await-in-loop
    while (await GuestUserModel.usernameExists(name)) {
      name = generateGuestUsername();
    }
  }

  // Create a user token
  const token = encodeToken(name);

  // Create a GuestUser document ...
  const guestUser = new GuestUserModel({
    username: name,
    expiresAt: token.expiresAt,
  });

  // ... and save it
  try {
    await guestUser.save();
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      throw new ValidationError(error);
    }
  }

  // Schedule guest deletion
  createUserExiprationJob(name);

  return {
    username: guestUser.username,
    token,
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
  return GuestUserModel.findOne({ username }).exec();
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
    const user = await GuestUserModel.findOne({ username }).exec();
    if (user) {
      return {
        username: user.username,
        expiresAt: user.expiresAt,
      };
    }
    throw new EntityNotFoundError('User', username);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError('token expired');
    } else if (error instanceof JsonWebTokenError) {
      throw new AuthenticationError('token invalid');
    } else {
      throw error;
    }
  }
};

const loginRegisteredUser = async (username: string, password: string): Promise<LoginResult> => {
  const user = await RegisteredUserModel.findOne({ username }).exec();
  if (!user) {
    throw new EntityNotFoundError('User', username);
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    throw new AuthenticationError('incorrect password');
  }

  return {
    username,
    token: encodeToken(user.username),
  };
};

const registerUser = async (username: string, password: string): Promise<LoginResult> => {
  const passwordHash = await bcrypt.hash(password, config.PWD_HASH_SALT_ROUNDS);

  const user = new RegisteredUserModel({
    username,
    passwordHash,
  });

  try {
    await user.save();
    return {
      username,
      token: encodeToken(user.username),
    };
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      throw new ValidationError(error);
    } else {
      throw error;
    }
  }
};

export default {
  createGuestUserAndToken,
  getGuestUser,
  getUserFromToken,
  loginRegisteredUser,
  registerUser,
};
