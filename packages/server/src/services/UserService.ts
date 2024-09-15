import bcrypt from "bcrypt";
import { add } from "date-fns";
import config from "../utils/config.js";
import { ValidationError } from "@battleship/common/repositories/Errors.js";
import { UsernameQueryResult } from "@battleship/common/types/__generated__/types.generated.js";
import UserRepository from "@battleship/common/repositories/UserRepository.js";
import GuestUserRepository from "@battleship/common/repositories/GuestUserRepository.js";
import RegisteredUserRepository from "@battleship/common/repositories/RegisteredUserRepository.js";
import {
  GuestUser,
  RegisteredUser,
  UserKind,
} from "@battleship/common/entities/UserDbModels.js";
import ServiceError from "./errors/ServiceError.js";
import AuthenticationError from "./errors/AuthenticationError.js";

/**
 * Has minimum 8 characters in length.
 * At least one uppercase English letter.
 * At least one lowercase English letter.
 * At least one digit.
 */
const PWD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

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

const calculateGuestExpirationDate = (): Date =>
  add(Date.now(), { seconds: config.GUEST_LIFETIME_SECONDS });

/**
 * Schedules the deletion of a guest user.
 *
 * @param user The guest user to be deleted
 */
const createUserExiprationJob = (user: GuestUser): void => {
  const timeout = user.expiresAt.getTime() - Date.now();

  if (timeout < 0)
    throw new ServiceError(
      "Cannot schedule guest user deletion: expiresAt is in the past",
    );

  setTimeout(() => {
    try {
      void UserRepository.deleteById(user.id);
    } catch {
      /* empty */
    }
  }, timeout);
};

const validatePassword = (password: string): boolean => {
  return PWD_REGEX.test(password);
};

/**
 * Check if a username is not taken and if it's valid.
 *
 * @param username The username to be checked.
 * @returns A UsernameQueryResult containing the passed username and properties
 *          indicating whether the username is taken already, or is valid.
 */
const checkUsername = async (
  username: string,
  userKind: UserKind,
): Promise<UsernameQueryResult> => {
  return {
    username,
    taken: await UserRepository.usernameAvailable(username, userKind),
    validationError: UserRepository.validateUsername(username),
  };
};

/**
 * Create a guest user.
 *
 * @param username Username for the guest, if none is provided a random one is generated.
 * @returns A Promise resolving to a GuestUser or throwing an appropriate error if the provided
 *          username is invalid in some way.
 */
const createGuestUser = async (username: string | null | undefined): Promise<GuestUser> => {
  let name = username;

  if (!name) {
    // If no username was requested, create a random one...
    name = generateGuestUsername();

    // ...and also make sure it's available
    // eslint-disable-next-line no-await-in-loop
    while (!(await UserRepository.usernameAvailable(name, UserKind.GuestUser))) {
      name = generateGuestUsername();
    }
  }

  const guestUser = await GuestUserRepository.create(
    name,
    calculateGuestExpirationDate(),
  );

  // Schedule guest deletion
  createUserExiprationJob(guestUser);

  return guestUser;
};

/**
 * Register a user.
 * If the given registration data is invalid, an appropriate error is thrown.
 *
 * @param username The new users username.
 * @param password The new users password.
 * @param email The new users email address.
 * @returns A promise resolving to a RegisteredUser.
 */
const createRegisteredUser = async (
  username: string,
  password: string,
  email: string,
): Promise<RegisteredUser> => {
  // Check the password and throw a ValidationError if it's invalid.
  if (!validatePassword(password)) {
    throw new ValidationError([
      {
        propertyName: "RegisteredUser.password",
        error: {
          value: password,
          message: "Password is invalid",
        },
      },
    ]);
  }

  // calculate the password hash to be saved
  const passwordHash = await bcrypt.hash(password, config.PWD_HASH_SALT_ROUNDS);

  // create the user
  const user = await RegisteredUserRepository.create(
    username,
    passwordHash,
    email,
  );

  return user;
};

/**
 * Authenticate registered user credentials
 * If no user for the given username is found, an EntityNotFoundError is thrown,
 * if the password is incorrect, an AuthenticationError is thrown.
 *
 * @param username Users username.
 * @param password Users password.
 * @returns A promise resolving to a RegisteredUser.
 */
const authenticateRegisteredUser = async (
  username: string,
  password: string,
): Promise<RegisteredUser> => {
  // find the db user entity for the provided username
  const user = await RegisteredUserRepository.getByUsername(username);

  // if a user is found, compare the password with the saved hash
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    // if the hashes don't match, throw the appropriate error
    throw new AuthenticationError("incorrect password");
  }

  return user;
};

export default {
  checkUsername,
  createGuestUser,
  createRegisteredUser,
  authenticateRegisteredUser,
};
