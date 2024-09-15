import jwt from "jsonwebtoken";
import { add } from "date-fns";
import config from "../utils/config.js";
import AuthenticationError from "./errors/AuthenticationError.js";
import { LoginResult } from "@battleship/common/types/__generated__/types.generated.js";
import SessionRepository from "@battleship/common/repositories/SessionRepository.js";
import { Session, UnpopulatedSession } from "@battleship/common/entities/SessionDbModel.js";
import { isGuestUser } from "@battleship/common/utils/typeUtils.js";
import UserRepository from "@battleship/common/repositories/UserRepository.js";
import { EntityNotFoundError } from "@battleship/common/repositories/Errors.js";
import ServiceError from "./errors/ServiceError.js";
import { User } from "@battleship/common/entities/UserDbModels.js";

export interface WSAuthTicket {
  userID: string;
  roomID: string;
}

const calculateTokenExpirationDate = (): Date =>
  add(Date.now(), { seconds: config.GUEST_LIFETIME_SECONDS });

const assertNotExpired = (session: Session | UnpopulatedSession): void => {
  if (session.expiresAt.getTime() <= Date.now()) {
    throw new AuthenticationError("token expired");
  }
}

/**
 * Create a temporary access token for a given session.
 *
 * @param session session to be encoded in the access token.
 * @returns The encoded token.
 */
const encodeToken = (session: Session | UnpopulatedSession): string => {
  // create the token with an expiration claim
  const token = jwt.sign(
    {
      exp: Math.floor(session.expiresAt.getTime() / 1000),
      sessionID: session.id,
    },
    config.JWT_SECRET,
  );

  return token;
};

/**
 * Decode an access token.
 *
 * @param token The token to be decoded.
 * @returns Decoded sessionID, or throws an error if the
 *          token is invalid or already expired
 */
const decodeToken = (token: string): string => {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    if (
      typeof payload === "object" &&
      "sessionID" in payload &&
      typeof payload.sessionID === "string"
    ) {
      return payload.sessionID;
    }
  } catch (jwtError) {
    if (jwtError instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError("token expired");
    }
  }

  throw new AuthenticationError("token invalid");
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
      "userID" in payload &&
      "roomID" in payload &&
      typeof payload.userID === "string" &&
      typeof payload.roomID === "string"
    ) {
      return {
        userID: payload.userID,
        roomID: payload.roomID,
      };
    }

    return false;
  } catch {
    return false;
  }
};

const createSession = async (user: User): Promise<UnpopulatedSession> => {
  let expiresAt = calculateTokenExpirationDate();

  if (isGuestUser(user)) {
    if (user.expiresAt.getTime() <= Date.now()) {
      throw new AuthenticationError("user expired");
    }

    expiresAt = user.expiresAt;
  }

  const session = await SessionRepository.create(user.id, expiresAt);
  return session;
};

/**
 * Decode user data from an access token.
 *
 * @param token The token to be decoded
 * @returns An object containig the username and expiration timestamp, or
 *          throws an error if the token is invalid or already expired
 */
const getSessionFromToken = async (token: string): Promise<UnpopulatedSession> => {
  // decode the token
  const sessionID = decodeToken(token);

  // fetch the user using the decoded Id
  const session = await SessionRepository.getById(sessionID);
  assertNotExpired(session);

  return session;
};

const getUserFromSession = async (session: UnpopulatedSession): Promise<User> => {
  assertNotExpired(session);

  try {
    return UserRepository.getById(session.user.toString());
  } catch (err) {
    if (err instanceof EntityNotFoundError) {
      throw new AuthenticationError("token invalid");
    }

    throw new ServiceError("Error when accessing User for Session");
  }
};

/**
 * Login an existing user.
 *
 * @param user The User for which a Session is being created.
 * @returns A promise rosolving to a LoginResult, which will contain the users username, id and
 *          a temporary access token and expiration timestamp.
 */
const loginUser = async (user: User): Promise<LoginResult> => {
  const session = await createSession(user);

  return {
    userID: user.id,
    username: user.username,
    accessToken: encodeToken(session),
    expiresAt: session.expiresAt.getTime().toString(),
  };
};

export default {
  encodeWSToken,
  decodeWSToken,
  getSessionFromToken,
  getUserFromSession,
  loginUser,
};
