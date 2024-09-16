import { describe, expect, it, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import {
  setupConnection,
  teardownConnection,
  setupUsers,
} from "../../test/mongooseUtils.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
  ALL_USERS,
} from "../../test/testUsers.js";
import GithubUserRepository from "./GithubUserRepository.js";
import UserDbModels, { User } from "../entities/UserDbModels.js";
import { EntityNotFoundError, ValidationError } from "./Errors.js";
import { UserKind } from "../types/__generated__/types.generated.js";

beforeEach(async () => {
  await setupConnection();
  await setupUsers();
});

afterEach(async () => {
  await teardownConnection();
});

describe("The GithubUserRepository", () => {
  it("fetches all existing github users", async () => {
    const users = await GithubUserRepository.getAll();

    expect(users.length).toEqual(GITHUB_USERS.length);
    expect(new Set(users)).toMatchObject(new Set(GITHUB_USERS));
    users.forEach((user) => {
      expect(typeof user.id).toBe("string");
    });
  });

  it.each([...GITHUB_USERS])(
    "fetches a github user by their id",
    async (user) => {
      const mongooseEntity = (await UserDbModels.GithubUser.findOne({
        username: user.username,
      }).exec()) as User;

      const repositoryEntity = await GithubUserRepository.getById(
        mongooseEntity.id,
      );

      expect(repositoryEntity).toMatchObject(user);
      expect(typeof repositoryEntity.id).toBe("string");
    },
  );

  it("throws an EntityNotFoundError when fetching an non-existing id", async () => {
    expect.hasAssertions();

    const id = new mongoose.Types.ObjectId();
    try {
      await GithubUserRepository.getById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it.each([...ALL_USERS.filter((u) => u.kind !== UserKind.GithubUser)])(
    "throws an EntityNotFoundError when fetching a non-github user",
    async ({ username, kind }) => {
      expect.hasAssertions();

      const userEntity = (await UserDbModels.User.findOne({
        username,
        kind,
      }).exec()) as User;

      try {
        await GithubUserRepository.getById(userEntity.id);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each([...GITHUB_USERS])(
    "fetches a github user by their username",
    async (user) => {
      const repositoryEntity = await GithubUserRepository.getByUsername(
        user.username,
      );

      expect(repositoryEntity).toMatchObject(user);
      expect(typeof repositoryEntity.id).toBe("string");
    },
  );

  it.each([
    [REGISTERED_USERS[0].username],
    [GUEST_USERS[0].username],
    ["someNonExistingUser"],
  ])(
    "throws an EntityNotFoundError when fetching an non-existing username",
    async (username) => {
      expect.hasAssertions();

      try {
        await GithubUserRepository.getByUsername(username);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each([
    [GUEST_USERS[0].username, "someGithubId", "someRefreshToken"],
    [REGISTERED_USERS[0].username, "someGithubId", "someRefreshToken"],
    ["CompletelyNewUsername_0-1", "someGithubId", "someRefreshToken"],
  ])(
    "successfully saves a new github user with valid data",
    async (username, githubId, refreshToken) => {
      const created = await GithubUserRepository.create(
        username,
        githubId,
        refreshToken,
      );

      expect(typeof created.id).toBe("string");
      expect(created.id.length).toBe(24);
      expect(created.kind).toBe(UserKind.GithubUser);
      expect(created.username).toEqual(username);
      expect(created.githubId).toEqual(githubId);
      expect(created.refreshToken).toEqual(refreshToken);

      const mongooseEntity = (await UserDbModels.User.findById(
        created.id,
      ).exec()) as object;

      expect(mongooseEntity).toMatchObject(created);
    },
  );

  it.each([
    [GITHUB_USERS[0].username, "someGithubId", "someRefreshToken", "username"],
    ["", "someGithubId", "someRefreshToken", "username"],
    ["abc", "someGithubId", "someRefreshToken", "username"],
    ["abcdef!", "someGithubId", "someRefreshToken", "username"],
    ["          ", "someGithubId", "someRefreshToken", "username"],
    ["CompletelyNewUsername_0-1", "", "someRefreshToken", "githubId"],
    [
      "CompletelyNewUsername_0-1",
      GITHUB_USERS[0].githubId,
      "someRefreshToken",
      "githubId",
    ],
    ["CompletelyNewUsername_0-1", "someGithubId", "", "refreshToken"],
  ])(
    "throws a ValidationError when attempting to create a github user with invalid data",
    async (username, githubId, refreshToken, invalidProperty) => {
      expect.hasAssertions();

      try {
        await GithubUserRepository.create(username, githubId, refreshToken);
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        const validationError = err as ValidationError;
        expect(validationError.invalidProperties).toHaveProperty(
          invalidProperty,
        );
        expect(validationError.message).toMatch("validation");
      }
    },
  );
});
