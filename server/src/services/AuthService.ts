import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { add } from "date-fns";
import { Error, Error as MongooseError } from "mongoose";

import config from "../utils/config.js";
import ValidationError from "./errors/ValidationError.js";
import EntityNotFoundError from "./errors/EntityNotFoundError.js";
import AuthenticationError from "./errors/AuthenticationError.js";
import UserDbModel from "./dbModels/UserDbModel.js";
import GuestUserDbModel from "./dbModels/GuestUserDbModel.js";
import RegisteredUserDbModel from "./dbModels/RegisteredUserDbModel.js";
import type { User } from "../models/User.js";
import {
  UsernameQueryResult,
  LoginResult,
} from "@battleship/common/types/__generated__/types.generated.js";

interface AccessToken {
  token: string;
  expiresAt: Date;
}

export interface WSAuthTicket {
  username: string;
  roomID: string;
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
  const token = jwt.sign({ username }, config.JWT_SECRET, {
    expiresIn: config.GUEST_LIFETIME_SECONDS,
  });

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
  if (
    typeof payload === "object" &&
    "username" in payload &&
    typeof payload.username === "string"
  ) {
    return payload.username;
  }

  // shouldn't really reach this
  throw new Error("Unexpected error while verifying access token");
};

/**
 * Create temporary access token to authenticate a websocket connetion.
 *
 * @param ticket The token data to encode
 * @returns An encoded access token
 */
const encodeWSToken = (ticket: WSAuthTicket): string => {
  // create the token with an expiration claim
  const token = jwt.sign(ticket, config.JWT_SECRET, {
    expiresIn: config.WS_AUTH_TICKET_LIFETIME_SECONDS,
  });

  return token;
};

/**
 * Decode a websocket access token.
 *
 * @param code The access code to be decoded.
 * @returns A valid WSAuthTicket if the access code is valid, or false if the access
 *          code is invalid or expired
 */
const decodeWSToken = (code: string): WSAuthTicket | false => {
  try {
    const payload = jwt.verify(code, config.JWT_SECRET);
    if (
      typeof payload === "object" &&
      "username" in payload &&
      "roomID" in payload &&
      typeof payload.username === "string" &&
      typeof payload.roomID === "string"
    ) {
      return {
        username: payload.username,
        roomID: payload.roomID,
      };
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Schedules the deletion of a guest user.
 *
 * @param username Username of the guest to be deleted
 */
const createUserExiprationJob = (username: string): void => {
  setTimeout(() => {
    void GuestUserDbModel.deleteOne({ username });
  }, config.GUEST_LIFETIME_SECONDS * 1000);
};

/**
 * Check if a uername is not taken.
 *
 * @param username The username to be checked.
 * @returns A UsernameQueryResult containing the passed username and properties
 *          indicating whether the username is taken already, or is valid.
 */
const checkUsername = async (
  username: string,
): Promise<UsernameQueryResult> => {
  let validationError: string | undefined;
  let taken: boolean = false;

  const newUser = new GuestUserDbModel({ username });

  try {
    await newUser.validate("username");
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const usernameError = error.errors.username;
      const { kind } = usernameError;

      if (kind !== "unique") {
        validationError = usernameError.message;
      } else {
        taken = true;
      }
    }
  }

  if (!taken && validationError === undefined) {
    taken = await GuestUserDbModel.usernameExists(username);
  }

  return {
    username,
    taken,
    validationError,
  };
};

/**
 * Create a guest user and an accompanying access token
 *
 * @param username Username for the guest, if none is provided a random one is generated.
 *                 If a username is specified and it is already taken, a UsernameTakenError
 *                 is thrown.
 * @returns The user data, including: username, expiration timestamp and access token.
 */
const createGuestUserAndToken = async (
  username: string | null,
): Promise<LoginResult> => {
  let name;

  if (username) {
    // If a username has been requested, check that it's available
    if (await GuestUserDbModel.usernameExists(username)) {
      throw new ValidationError({
        property: "username",
        errorKind: "unique",
        value: username,
        message: `Username ${username} is already taken`,
      });
    }

    name = username;
  } else {
    // If no username was requested, create a random one...
    name = generateGuestUsername();

    // ...and also make sure it's available
    // eslint-disable-next-line no-await-in-loop
    while (await GuestUserDbModel.usernameExists(name)) {
      name = generateGuestUsername();
    }
  }

  // Create a user token
  const token = encodeToken(name);

  // Create a GuestUser document ...
  const guestUser = new GuestUserDbModel({
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

    throw error;
  }

  // Schedule guest deletion
  createUserExiprationJob(name);

  return {
    username: guestUser.username,
    accessToken: token.token,
    expiresAt: token.expiresAt.getTime().toString(),
  };
};

/**
 * Get an existing User entity.
 *
 * @param username The name of the user to be retrieved.
 * @returns A Promise resolving the user data, or null or undefined if
 *          no user with the given username exists.
 */
// eslint-disable-next-line arrow-body-style
const getUser = async (username: string): Promise<User | null | undefined> => {
  return UserDbModel.findOne({ username }).exec();
};

/**
 * Decode user data from an access token.
 *
 * @param token The token to be decoded
 * @returns An object containig the username and expiration timestamp, or
 *          throws an error if the token is invalid or already expired
 */
const getUserFromToken = async (token: string): Promise<User> => {
  try {
    // try to decode the token
    const username = decodeToken(token);

    // try to fetch a db entity for the decoded username
    const user = await UserDbModel.findOne({ username }).exec();

    if (user) {
      // if the user exists, return the id and username
      return {
        // eslint-disable-next-line no-underscore-dangle
        id: user._id.toString(),
        username: user.username,
      };
    }
    // throw a not found error if no user is found for the decoded username
    throw new EntityNotFoundError("User", username);
  } catch (error) {
    // throw appropriate service errors
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError("token invalid");
    } else {
      throw error;
    }
  }
};

/**
 * Login an existing registered user.
 * If no user for the given username is found, an EntityNotFoundError is thrown,
 * if the password is incorrect, an AuthenticationError is thrown.
 *
 * @param username Users username.
 * @param password Users password.
 * @returns A promise rosolving to a LoginResult, which will contain the users username and
 *          a temporary access token.
 */
const loginRegisteredUser = async (
  username: string,
  password: string,
): Promise<LoginResult> => {
  // find the db user entity for the provided username
  const user = await RegisteredUserDbModel.findOne({ username }).exec();
  if (!user) {
    // if no such user exists, throw an entity not found error
    throw new EntityNotFoundError("User", username);
  }

  // if a user is found, compare the password with the saved hash
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    // if the hashes don't match, throw the appropriate error
    throw new AuthenticationError("incorrect password");
  }

  const token = encodeToken(user.username);

  return {
    username: user.username,
    accessToken: token.token,
    expiresAt: token.expiresAt.getTime().toString(),
  };
};

/**
 * Register a user.
 * If the given registration data is invalid, an appropriate error is thrown.
 *
 * @param username The new users username.
 * @param password The new users password
 * @returns A promise rosolving to a LoginResult, which will contain the users username and
 *          a temporary access token.
 */
const registerUser = async (
  username: string,
  password: string,
): Promise<LoginResult> => {
  // TODO: validate password before hashing !!!
  // calculate the password hash to be saved
  const passwordHash = await bcrypt.hash(password, config.PWD_HASH_SALT_ROUNDS);

  // construct a new db entity
  const user = new RegisteredUserDbModel({
    username,
    passwordHash,
  });

  try {
    // save the db entity
    await user.save();
    // create an access token
    const token = encodeToken(user.username);

    // and return the username and access token
    return {
      username: user.username,
      accessToken: token.token,
      expiresAt: token.expiresAt.getTime().toString(),
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
  checkUsername,
  createGuestUserAndToken,
  getUser,
  getUserFromToken,
  loginRegisteredUser,
  registerUser,
  encodeWSToken,
  decodeWSToken,
};
