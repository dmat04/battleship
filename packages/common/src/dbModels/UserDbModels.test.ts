import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  GithubUser,
  GithubUserDbModel,
  GuestUser,
  GuestUserDbModel,
  RegisteredUser,
  RegisteredUserDbModel,
  UserKind,
} from "./UserDbModels.js";

const GUEST_USERS: Omit<GuestUser, "id">[] = [
  {
    username: "UserA",
    kind: UserKind.GuestUser,
    expiresAt: new Date(),
  },
  {
    username: "SomeGuestUser",
    kind: UserKind.GuestUser,
    expiresAt: new Date(),
  },
];

const REGISTERED_USERS: Omit<RegisteredUser, "id">[] = [
  {
    username: "UserB",
    kind: UserKind.RegisteredUser,
    passwordHash: "SomeVeryLongHash",
    email: "userb@domain.com",
    emailConfirmed: true,
  },
];

const GITHUB_USERS: Omit<GithubUser, "id">[] = [
  {
    username: "UserC",
    kind: UserKind.GithubUser,
    githubId: "SomeGitHubId",
    refreshToken: "SomeGithubRefreshToken",
  },
];

let mongoServer: MongoMemoryServer | null = null;
let mongoURL: string | null = null;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoURL = mongoServer.getUri();
  await mongoose.connect(mongoURL);

  const modelInitPromises = [
    GuestUserDbModel.init(),
    RegisteredUserDbModel.init(),
    GithubUserDbModel.init()
  ];
  await Promise.all(modelInitPromises);

  const dataInitPromises = [
    GuestUserDbModel.create(GUEST_USERS),
    RegisteredUserDbModel.create(REGISTERED_USERS),
    GithubUserDbModel.create(GITHUB_USERS),
  ];
  await Promise.all(dataInitPromises);
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

describe("The GuestUser mongoose model", () => {
  it("retrieves all existing guest users", async () => {
    const guestUsers = await GuestUserDbModel.find({});
    expect(guestUsers).toMatchObject(GUEST_USERS);
  });

  it("successfully saves a valid document", async () => {
    const expiresAt = new Date();
    const username = "TestGuestUser";

    await GuestUserDbModel.create({
      username,
      expiresAt,
    });

    const document = await GuestUserDbModel.findOne({ username });
    const count = await GuestUserDbModel.countDocuments({});

    expect(document?.id).toBeDefined;
    expect(document?.username).toEqual(username);
    expect(document?.expiresAt).toEqual(expiresAt);
    expect(count).toEqual(GUEST_USERS.length + 1);
  });

  it("throws a validation error when saving a guest user with an existing username", async () => {
    const expiresAt = new Date();
    const { username } = GUEST_USERS[0];

    const user = new GuestUserDbModel({
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
      const user = new GuestUserDbModel({
        username,
        expiresAt,
      });

      await expect(user.save()).rejects.toThrowError("validation");
    },
  );

  it("successfully saves a guest user when another type of user with the same username exists", async () => {
    const expiresAt = new Date();
    const { username } = REGISTERED_USERS[0];

    await GuestUserDbModel.create({
      username,
      expiresAt,
    });

    const user = await GuestUserDbModel.findOne({ username });

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
      await expect(GuestUserDbModel.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});

describe("The RegisteredUser mongoose model", () => {
  it("retrieves all existing registered users", async () => {
    const registeredUsers = await RegisteredUserDbModel.find({});
    expect(registeredUsers).toMatchObject(REGISTERED_USERS);
  });

  it("successfully saves a valid document", async () => {
    const username = "TestRegisteredUser";
    const passwordHash = "someCalculatedHash";
    const email = "reguser@domain.com";
    const emailConfirmed = false;

    await RegisteredUserDbModel.create({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    const document = await RegisteredUserDbModel.findOne({ username });
    const count = await RegisteredUserDbModel.countDocuments({});

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

    const user = new RegisteredUserDbModel({
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
      const user = new RegisteredUserDbModel({
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

    await RegisteredUserDbModel.create({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    const user = await RegisteredUserDbModel.findOne({ username });

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
      await expect(
        RegisteredUserDbModel.usernameExists(username),
      ).resolves.toEqual(exists);
    },
  );
});

describe("The GithubUser mongoose model", () => {
  it("retrieves all existing github users", async () => {
    const githubUsers = await GithubUserDbModel.find({});
    expect(githubUsers).toMatchObject(GITHUB_USERS);
  });

  it("successfully saves a valid document", async () => {
    const username = "TestGithubUser";
    const githubId = "testGithubId";
    const refreshToken = "testGithubRefreshToken";
    

    await GithubUserDbModel.create({
      username,
      githubId,
      refreshToken
    });

    const document = await GithubUserDbModel.findOne({ username });
    const count = await GithubUserDbModel.countDocuments({});

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
    

    const user = new GithubUserDbModel({
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
      const user = new GithubUserDbModel({
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

    await GithubUserDbModel.create({
      username,
      githubId,
      refreshToken,
    });

    const user = await GithubUserDbModel.findOne({ username });

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
      await expect(GithubUserDbModel.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});
