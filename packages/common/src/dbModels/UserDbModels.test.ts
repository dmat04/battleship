import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User, { UserKind } from "./UserDbModels.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
} from "../../test/testUsers.js";

let mongoServer: MongoMemoryServer | null = null;
let mongoURL: string | null = null;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoURL = mongoServer.getUri();
  await mongoose.connect(mongoURL);

  const modelInitPromises = [
    User.Guest.init(),
    User.Registered.init(),
    User.Github.init(),
  ];
  await Promise.all(modelInitPromises);

  const dataInitPromises = [
    User.Guest.create(GUEST_USERS),
    User.Registered.create(REGISTERED_USERS),
    User.Github.create(GITHUB_USERS),
  ];
  await Promise.all(dataInitPromises);
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

describe("The GuestUser mongoose model", () => {
  it("retrieves all existing guest users", async () => {
    const guestUsers = await User.Guest.find({});
    expect(new Set(guestUsers)).toMatchObject(new Set(GUEST_USERS));
  });

  it("successfully saves a valid document", async () => {
    const expiresAt = new Date();
    const username = "TestGuestUser";

    await User.Guest.create({
      username,
      expiresAt,
    });

    const document = await User.Guest.findOne({ username });
    const count = await User.Guest.countDocuments({});

    expect(document?.id).toBeDefined;
    expect(document?.username).toEqual(username);
    expect(document?.expiresAt).toEqual(expiresAt);
    expect(count).toEqual(GUEST_USERS.length + 1);
  });

  it("throws a validation error when saving a guest user with an existing username", async () => {
    const expiresAt = new Date();
    const { username } = GUEST_USERS[0];

    const user = new User.Guest({
      username,
      expiresAt,
    });

    await expect(user.save()).rejects.toThrowError("username must be unique");
  });

  it.each([
    ["a", new Date()],
    ["", new Date()],
    ["abcdef!", new Date()],
    [undefined, new Date()],
    ["abcdef", undefined],
  ])(
    "throws a validation error when atempting to save an invalid document",
    async (username, expiresAt) => {
      const user = new User.Guest({
        username,
        expiresAt,
      });

      await expect(user.save()).rejects.toThrowError("validation");
    },
  );

  it("successfully saves a guest user when another type of user with the same username exists", async () => {
    const expiresAt = new Date();
    const { username } = REGISTERED_USERS[0];

    await User.Guest.create({
      username,
      expiresAt,
    });

    const user = await User.Guest.findOne({ username });

    expect(user?.id).toBeDefined;
    expect(user?.username).toEqual(username);
    expect(user?.expiresAt).toEqual(expiresAt);
    expect(user?.kind).toEqual(UserKind.GuestUser);
  });

  it.each([
    [GUEST_USERS[0].username, true],
    [GUEST_USERS[1].username, true],
    [REGISTERED_USERS[0].username, false],
    [GITHUB_USERS[0].username, false],
    ["CompletelyNewUsername", false],
  ])(
    "the static usernameExists method works correctly for GuestUsers",
    async (username, exists) => {
      await expect(User.Guest.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});

describe("The RegisteredUser mongoose model", () => {
  it("retrieves all existing registered users", async () => {
    const registeredUsers = await User.Registered.find({});
    expect(new Set(registeredUsers)).toMatchObject(new Set(REGISTERED_USERS));
  });

  it("successfully saves a valid document", async () => {
    const username = "TestRegisteredUser";
    const passwordHash = "someCalculatedHash";
    const email = "reguser@domain.com";
    const emailConfirmed = false;

    await User.Registered.create({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    const document = await User.Registered.findOne({ username });
    const count = await User.Registered.countDocuments({});

    expect(document?.id).toBeDefined;
    expect(document?.username).toEqual(username);
    expect(document?.passwordHash).toEqual(passwordHash);
    expect(document?.email).toEqual(email);
    expect(document?.emailConfirmed).toEqual(emailConfirmed);
    expect(count).toEqual(REGISTERED_USERS.length + 1);
  });

  it("throws a validation error when saving a registered user with an existing username", async () => {
    const { username } = REGISTERED_USERS[0];
    const passwordHash = "someCalculatedHash";
    const email = "reguser@domain.com";
    const emailConfirmed = false;

    const user = new User.Registered({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    await expect(user.save()).rejects.toThrowError("username must be unique");
  });

  it.each([
    [undefined, "someVeryLongPasswordHash", "aValidEmail@domain.com", false],
    ["", "someVeryLongPasswordHash", "aValidEmail@domain.com", false],
    ["a", "someVeryLongPasswordHash", "aValidEmail@domain.com", false],
    [
      "asdf1223!ab",
      "someVeryLongPasswordHash",
      "aValidEmail@domain.com",
      false,
    ],
    ["TestRegisteredUser", undefined, "testRegisteredUser@domain.com", false],
    ["TestRegisteredUser", "", "testRegisteredUser@domain.com", false],
    ["TestRegisteredUser", "someVeryLongPasswordHash", undefined, false],
    [
      "TestRegisteredUser",
      "someVeryLongPasswordHash",
      "invalidEmail.com",
      false,
    ],
    ["TestRegisteredUser", "someVeryLongPasswordHash", "@domain.com", false],
    ["TestRegisteredUser", "someVeryLongPasswordHash", "username@", false],
    ["TestRegisteredUser", "someVeryLongPasswordHash", "a b@domain.com", false],
    [
      "TestRegisteredUser",
      "someVeryLongPasswordHash",
      REGISTERED_USERS[0].email,
      false,
    ],
  ])(
    "throws a validation error when atempting to save an invalid document",
    async (username, passwordHash, email, emailConfirmed) => {
      const user = new User.Registered({
        username,
        passwordHash,
        email,
        emailConfirmed,
      });

      await expect(user.save()).rejects.toThrowError("validation");
    },
  );

  it("successfully saves a registered user when another type of user with the same username exists", async () => {
    const { username } = GUEST_USERS[0];
    const passwordHash = "someCalculatedHash";
    const email = "reguser@domain.com";
    const emailConfirmed = false;

    await User.Registered.create({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    const user = await User.Registered.findOne({ username });

    expect(user?.id).toBeDefined;
    expect(user?.username).toEqual(username);
    expect(user?.passwordHash).toEqual(passwordHash);
    expect(user?.email).toEqual(email);
    expect(user?.emailConfirmed).toEqual(emailConfirmed);
    expect(user?.kind).toEqual(UserKind.RegisteredUser);
  });

  it.each([
    [REGISTERED_USERS[0].username, true],
    [GUEST_USERS[0].username, false],
    [GITHUB_USERS[0].username, false],
    ["CompletelyNewUsername", false],
  ])(
    "the static usernameExists method works correctly for RegisteredUsers",
    async (username, exists) => {
      await expect(User.Registered.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});

describe("The GithubUser mongoose model", () => {
  it("retrieves all existing github users", async () => {
    const githubUsers = await User.Github.find({});
    expect(new Set(githubUsers)).toMatchObject(new Set(GITHUB_USERS));
  });

  it("successfully saves a valid document", async () => {
    const username = "TestGithubUser";
    const githubId = "testGithubId";
    const refreshToken = "testGithubRefreshToken";

    await User.Github.create({
      username,
      githubId,
      refreshToken,
    });

    const document = await User.Github.findOne({ username });
    const count = await User.Github.countDocuments({});

    expect(document?.id).toBeDefined;
    expect(document?.username).toEqual(username);
    expect(document?.githubId).toEqual(githubId);
    expect(document?.refreshToken).toEqual(refreshToken);
    expect(count).toEqual(GITHUB_USERS.length + 1);
  });

  it("throws a validation error when saving a github user with an existing username", async () => {
    const { username } = GITHUB_USERS[0];
    const githubId = "testGithubId";
    const refreshToken = "testGithubRefreshToken";

    const user = new User.Github({
      username,
      githubId,
      refreshToken,
    });

    await expect(user.save()).rejects.toThrowError("username must be unique");
  });

  it.each([
    [undefined, "aValidGHUserId", "aValidRefreshToken"],
    ["", "aValidGHUserId", "aValidRefreshToken"],
    ["a", "aValidGHUserId", "aValidRefreshToken"],
    ["asdf123'b", "aValidGHUserId", "aValidRefreshToken"],
    ["newGithubUsername", undefined, "aValidRefreshToken"],
    ["newGithubUsername", "", "aValidRefreshToken"],
    ["newGithubUsername", GITHUB_USERS[0].githubId, "aValidRefreshToken"],
    ["newGithubUsername", "aValidGHUserId", undefined],
    ["newGithubUsername", "aValidGHUserId", ""],
  ])(
    "throws a validation error when atempting to save an invalid document",
    async (username, githubId, refreshToken) => {
      const user = new User.Github({
        username,
        githubId,
        refreshToken,
      });

      await expect(user.save()).rejects.toThrowError("validation");
    },
  );

  it("successfully saves a github user when another type of user with the same username exists", async () => {
    const { username } = REGISTERED_USERS[0];
    const githubId = "testGithubId";
    const refreshToken = "testGithubRefreshToken";

    await User.Github.create({
      username,
      githubId,
      refreshToken,
    });

    const user = await User.Github.findOne({ username });

    expect(user?.id).toBeDefined;
    expect(user?.username).toEqual(username);
    expect(user?.githubId).toEqual(githubId);
    expect(user?.refreshToken).toEqual(refreshToken);
    expect(user?.kind).toEqual(UserKind.GithubUser);
  });

  it.each([
    [GITHUB_USERS[0].username, true],
    [REGISTERED_USERS[0].username, false],
    [GUEST_USERS[0].username, false],
    [GUEST_USERS[1].username, false],
    ["CompletelyNewUsername", false],
  ])(
    "the static usernameExists method works correctly for GithubUsers",
    async (username, exists) => {
      await expect(User.Github.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});
