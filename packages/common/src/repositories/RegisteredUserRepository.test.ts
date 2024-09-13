import { describe, expect, it, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import { setup, teardown } from "../../test/mongooseUtils.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
  ALL_USERS,
} from "../../test/testUsers.js";
import RegisteredUserRepository from "./RegisteredUserRepository.js";
import UserDbModels, { User, UserKind } from "../entities/UserDbModels.js";
import { EntityNotFoundError, ValidationError } from "./Errors.js";

beforeEach(async () => {
  await setup();
});

afterEach(async () => {
  await teardown();
});

describe("The RegisteredUserRepository", () => {
  it("fetches all existing registered users", async () => {
    const users = await RegisteredUserRepository.getAll();

    expect(users.length).toEqual(REGISTERED_USERS.length);
    expect(new Set(users)).toMatchObject(new Set(REGISTERED_USERS));
    users.forEach((user) => {
      expect(typeof user.id).toBe("string");
    });
  });

  it.each([...REGISTERED_USERS])(
    "fetches a registered user by their id",
    async (user) => {
      const mongooseEntity = (await UserDbModels.RegisteredUser.findOne({
        username: user.username,
      }).exec()) as User;

      const repositoryEntity = await RegisteredUserRepository.getById(
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
      await RegisteredUserRepository.getById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it.each([...ALL_USERS.filter((u) => u.kind !== UserKind.RegisteredUser)])(
    "throws an EntityNotFoundError when fetching a non-registered user",
    async ({ username, kind }) => {
      expect.hasAssertions();

      const userEntity = (await UserDbModels.User.findOne({
        username,
        kind,
      }).exec()) as User;

      try {
        await RegisteredUserRepository.getById(userEntity.id);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each([...REGISTERED_USERS])(
    "fetches a registered user by their username",
    async (user) => {
      const repositoryEntity = await RegisteredUserRepository.getByUsername(
        user.username,
      );

      expect(repositoryEntity).toMatchObject(user);
      expect(typeof repositoryEntity.id).toBe("string");
    },
  );

  it.each([
    [GITHUB_USERS[0].username],
    [GUEST_USERS[0].username],
    ["someNonExistingUser"],
  ])(
    "throws an EntityNotFoundError when fetching an non-existing username",
    async (username) => {
      expect.hasAssertions();

      try {
        await RegisteredUserRepository.getByUsername(username);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each([
    [GUEST_USERS[0].username, "passwordHash", "username@domain.com"],
    [GITHUB_USERS[0].username, "passwordHash", "username@domain.com"],
    ["CompletelyNewUsername_0-1", "passwordHash", "username@domain.com"],
  ])(
    "successfully saves a new registered user with valid data",
    async (username, passwordHash, email) => {
      const created = await RegisteredUserRepository.create(
        username,
        passwordHash,
        email,
      );

      expect(typeof created.id).toBe("string");
      expect(created.id.length).toBe(24);
      expect(created.kind).toBe(UserKind.RegisteredUser);
      expect(created.username).toEqual(username);
      expect(created.passwordHash).toEqual(passwordHash);
      expect(created.email).toEqual(email);
      expect(created.emailConfirmed).toBeFalsy();

      const mongooseEntity = (await UserDbModels.User.findById(
        created.id,
      ).exec()) as object;

      expect(mongooseEntity).toMatchObject(created);
    },
  );

  it.each([
    [REGISTERED_USERS[0].username, "passwordHash", "username@domain.com", "username"],
    ["", "passwordHash", "username@domain.com", "username"],
    ["abc", "passwordHash", "username@domain.com", "username"],
    ["abcdef!", "passwordHash", "username@domain.com", "username"],
    ["          ", "passwordHash", "username@domain.com", "username"],
    ["UserXYZ", "", "username@domain.com", "passwordHash"],
    ["UserXYZ", "paswordHash", REGISTERED_USERS[0].email, "email"],
    ["UserXYZ", "paswordHash", "", "email"],
    ["UserXYZ", "paswordHash", "   ", "email"],
    ["UserXYZ", "paswordHash", "abc def@domain.com", "email"],
    ["UserXYZ", "paswordHash", "abcdef@dom ain.com", "email"],
    ["UserXYZ", "paswordHash", "usernamedomain.com", "email"],
  ])(
    "throws a ValidationError when attempting to create a registered user with invalid data",
    async (username, passwordHash, email, invalidProperty) => {
      expect.hasAssertions();

      try {
        await RegisteredUserRepository.create(username, passwordHash, email);
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

  it("successfully deletes an existing registered user", async () => {
    const mongooseEntity = (await UserDbModels.User.findOne({
      username: REGISTERED_USERS[0].username,
      kind: UserKind.RegisteredUser,
    }).exec()) as User;

    const deleted = await RegisteredUserRepository.deleteById(
      mongooseEntity.id,
    );
    expect(mongooseEntity).toMatchObject(deleted);

    const afterDeletion = await UserDbModels.User.findById(deleted.id).exec();
    expect(afterDeletion).toBe(null);
  });

  it("throws an EntityNotFoundError when deleting a non-existing registered user", async () => {
    expect.hasAssertions();

    const id = new mongoose.Types.ObjectId();

    try {
      await RegisteredUserRepository.deleteById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it.each([...ALL_USERS.filter((u) => u.kind !== UserKind.RegisteredUser)])(
    "throws an EntityNotFoundError when deleting a non-registered user",
    async ({ username, kind }) => {
      expect.hasAssertions();

      const userEntity = (await UserDbModels.User.findOne({
        username,
        kind,
      }).exec()) as User;

      try {
        await RegisteredUserRepository.deleteById(userEntity.id);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );
});
