import { describe, expect, it, beforeEach, afterEach } from "vitest";
import Model, { UserKind } from "./UserDbModels.js";
import { setup, teardown } from "../../test/mongooseUtils.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
} from "../../test/testUsers.js";

beforeEach(async () => {
  await setup();
});

afterEach(async () => {
  await teardown();
});

describe("The GuestUser mongoose model", () => {
  it("retrieves all existing guest users", async () => {
    const guestUsers = await Model.GuestUser.find({});
    expect(new Set(guestUsers)).toMatchObject(new Set(GUEST_USERS));
  });

  it("successfully saves a valid document", async () => {
    const expiresAt = new Date();
    const username = "TestGuestUser";

    await Model.GuestUser.create({
      username,
      expiresAt,
    });

    const document = await Model.GuestUser.findOne({ username });
    const count = await Model.GuestUser.countDocuments({});

    expect(document?.id).toBeDefined;
    expect(document?.username).toEqual(username);
    expect(document?.expiresAt).toEqual(expiresAt);
    expect(count).toEqual(GUEST_USERS.length + 1);
  });

  it("throws a validation error when saving a guest user with an existing username", async () => {
    const expiresAt = new Date();
    const { username } = GUEST_USERS[0];

    const user = new Model.GuestUser({
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
      const user = new Model.GuestUser({
        username,
        expiresAt,
      });

      await expect(user.save()).rejects.toThrowError("validation");
    },
  );

  it("successfully saves a guest user when another type of user with the same username exists", async () => {
    const expiresAt = new Date();
    const { username } = REGISTERED_USERS[0];

    await Model.GuestUser.create({
      username,
      expiresAt,
    });

    const user = await Model.GuestUser.findOne({ username });

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
      await expect(Model.GuestUser.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});

describe("The RegisteredUser mongoose model", () => {
  it("retrieves all existing registered users", async () => {
    const registeredUsers = await Model.RegisteredUser.find({});
    expect(new Set(registeredUsers)).toMatchObject(new Set(REGISTERED_USERS));
  });

  it("successfully saves a valid document", async () => {
    const username = "TestRegisteredUser";
    const passwordHash = "someCalculatedHash";
    const email = "reguser@domain.com";
    const emailConfirmed = false;

    await Model.RegisteredUser.create({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    const document = await Model.RegisteredUser.findOne({ username });
    const count = await Model.RegisteredUser.countDocuments({});

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

    const user = new Model.RegisteredUser({
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
      const user = new Model.RegisteredUser({
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

    await Model.RegisteredUser.create({
      username,
      passwordHash,
      email,
      emailConfirmed,
    });

    const user = await Model.RegisteredUser.findOne({ username });

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
      await expect(Model.RegisteredUser.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});

describe("The GithubUser mongoose model", () => {
  it("retrieves all existing github users", async () => {
    const githubUsers = await Model.GithubUser.find({});
    expect(new Set(githubUsers)).toMatchObject(new Set(GITHUB_USERS));
  });

  it("successfully saves a valid document", async () => {
    const username = "TestGithubUser";
    const githubId = "testGithubId";
    const refreshToken = "testGithubRefreshToken";

    await Model.GithubUser.create({
      username,
      githubId,
      refreshToken,
    });

    const document = await Model.GithubUser.findOne({ username });
    const count = await Model.GithubUser.countDocuments({});

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

    const user = new Model.GithubUser({
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
      const user = new Model.GithubUser({
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

    await Model.GithubUser.create({
      username,
      githubId,
      refreshToken,
    });

    const user = await Model.GithubUser.findOne({ username });

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
      await expect(Model.GithubUser.usernameExists(username)).resolves.toEqual(
        exists,
      );
    },
  );
});

describe("The User model utility methods", () => {
  it.todo("test the exported util methods");
});
