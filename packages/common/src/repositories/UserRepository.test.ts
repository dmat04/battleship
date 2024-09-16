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
import UserRepository from "./UserRepository.js";
import UserDbModels, { User } from "../entities/UserDbModels.js";
import { EntityNotFoundError } from "./Errors.js";
import { UserKind } from "../types/__generated__/types.generated.js";

beforeEach(async () => {
  await setupConnection();
  await setupUsers();
});

afterEach(async () => {
  await teardownConnection();
});

describe("The UserRepository", () => {
  it("fetches all existing users", async () => {
    const users = await UserRepository.getAll();

    expect(new Set(users)).toMatchObject(new Set(ALL_USERS));
    users.forEach((user) => {
      expect(typeof user.id).toBe("string");
    });
  });

  it.each([...ALL_USERS])("fetches a user by their id", async (user) => {
    const mongooseEntity = (await UserDbModels.User.findOne(
      user,
    ).exec()) as User;

    const repositoryEntity = await UserRepository.getById(mongooseEntity.id);

    expect(repositoryEntity).toMatchObject(user);
    expect(typeof repositoryEntity.id).toBe("string");
  });

  it("throws an EntityNotFoundError when fetching an non-existing id", async () => {
    expect.hasAssertions();

    const id = new mongoose.Types.ObjectId();
    try {
      await UserRepository.getById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it.each([...ALL_USERS])(
    "fetches a user by their username and kind",
    async (user) => {
      const repositoryEntity = (await UserRepository.getByUsernameAndKind(
        user.username,
        user.kind,
      )) as User;

      expect(repositoryEntity).toMatchObject(user);
      expect(typeof repositoryEntity.id).toBe("string");
    },
  );

  it.each([
    [GUEST_USERS[0].username, UserKind.RegisteredUser],
    [REGISTERED_USERS[0].username, UserKind.GuestUser],
    ["someNonExistingUser", UserKind.GuestUser],
  ])(
    "throws an EntityNotFoundError when fetching an non-existing username-kind combination",
    async (username, kind) => {
      expect.hasAssertions();

      try {
        await UserRepository.getByUsernameAndKind(username, kind);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each(["", "a", "!a", "abc!def", " asdccs", "           ", ""])(
    "returns an error message when validating an invalid username",
    (username) => {
      const error = UserRepository.validateUsername(username);

      expect(typeof error).toBe("string");
      expect((error as string).length).toBeGreaterThan(0);
    },
  );

  it.each([
    "abcde",
    "_abcd",
    "-abcd",
    "01234",
    "012ab",
    "01-abc",
    "01_abc",
    "---_-",
  ])("returns undefined when validating a valid username", (username) => {
    const error = UserRepository.validateUsername(username);

    expect(typeof error).toBe("undefined");
  });

  it.each([...ALL_USERS])(
    "returns false when checking if a taken username is available",
    async ({ username, kind }) => {
      const available = await UserRepository.usernameAvailable(username, kind);

      expect(available).toBeFalsy();
    },
  );

  it.each([
    [GUEST_USERS[0].username, UserKind.RegisteredUser],
    [REGISTERED_USERS[0].username, UserKind.GithubUser],
    [GITHUB_USERS[0].username, UserKind.GuestUser],
    ["someNonExistingUsername", UserKind.GuestUser],
  ])(
    "returns true when checking if an available username is available",
    async (username, kind) => {
      const available = await UserRepository.usernameAvailable(username, kind);

      expect(available).toBeTruthy();
    },
  );

  it.each([...ALL_USERS])(
    "successfully deletes an existing user",
    async (user) => {
      const mongooseEntity = (await UserDbModels.User.findOne({
        username: user.username,
        kind: user.kind,
      }).exec()) as User;

      const countBefore = await UserDbModels.User.countDocuments().exec();
      const deleted = await UserRepository.deleteById(mongooseEntity.id);
      expect(mongooseEntity).toMatchObject(deleted);

      const afterDeletion = await UserDbModels.User.findById(deleted.id).exec();
      expect(afterDeletion).toBe(null);

      const countAfter = await UserDbModels.User.countDocuments().exec();
      expect(countAfter).toBe(countBefore - 1);
    },
  );

  it("throws an EntityNotFoundError when deleting a non-existing user", async () => {
    expect.hasAssertions();

    const id = new mongoose.Types.ObjectId();

    try {
      await UserRepository.deleteById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });
});
