import { add } from 'date-fns';

export interface GuestUserData {
  username: string,
  expiresAt: Date
}

export class UsernameTakenError extends Error {
  constructor(readonly username: string) {
    super(`Username ${username} is already taken`);
  }
}

const GUEST_LIFETIME_MS = 24 * 3600 * 1000;

const registeredGuests = new Map<string, GuestUserData>();

const generateGuestUsername = (): string => {
  const randomId = Math.random() * 100_000;
  return `Guest#${Math.floor(randomId)}`;
};

const createUserExiprationJob = (username: string): void => {
  setTimeout(() => {
    registeredGuests.delete(username);
  }, GUEST_LIFETIME_MS);
};

const usernameExists = (username: string): boolean => registeredGuests.has(username);

const createGuestUser = (username?: string): GuestUserData => {
  const expiresAt = add(Date.now(), { hours: 24 });
  let user = null;

  if (username) {
    if (usernameExists(username)) {
      throw new UsernameTakenError(username);
    }

    user = { username, expiresAt };
  }

  let randomName = generateGuestUsername();
  while (usernameExists(randomName)) {
    randomName = generateGuestUsername();
  }

  user = { username: randomName, expiresAt };
  createUserExiprationJob(user.username);

  return user;
};

// eslint-disable-next-line arrow-body-style
const getGuestUser = (username: string): GuestUserData | undefined => {
  return registeredGuests.get(username);
};

export default {
  createGuestUser,
  getGuestUser,
};
