import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { addDays, addMinutes, subHours } from "date-fns"
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
import GuestUserRepository from "./GuestUserRepository.js";
import UserDbModels, { User, UserKind } from "../entities/UserDbModels.js";
import { EntityNotFoundError, ValidationError } from "./Errors.js";

beforeEach(async () => {
  await setupConnection();
  await setupUsers();
});

afterEach(async () => {
  await teardownConnection();
});

describe("The GuestUserRepository", () => {
  it("fetches all existing guest users", async () => {
    const users = await GuestUserRepository.getAll();

    expect(users.length).toEqual(GUEST_USERS.length);
    expect(new Set(users)).toMatchObject(new Set(GUEST_USERS));
    users.forEach((user) => {
      expect(typeof user.id).toBe("string");
    });
  });

  it.each([...GUEST_USERS])(
    "fetches a guest user by their id",
    async (user) => {
      const mongooseEntity = (await UserDbModels.GuestUser.findOne({
        username: user.username,
      }).exec()) as User;

      const repositoryEntity = await GuestUserRepository.getById(
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
      await GuestUserRepository.getById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it.each([...ALL_USERS.filter((u) => u.kind !== UserKind.GuestUser)])(
    "throws an EntityNotFoundError when fetching a non-guest user",
    async ({ username, kind }) => {
      expect.hasAssertions();

      const userEntity = (await UserDbModels.User.findOne({
        username,
        kind,
      }).exec()) as User;

      try {
        await GuestUserRepository.getById(userEntity.id);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each([...GUEST_USERS])(
    "fetches a guest user by their username",
    async (user) => {
      const repositoryEntity = await GuestUserRepository.getByUsername(
        user.username,
      );

      expect(repositoryEntity).toMatchObject(user);
      expect(typeof repositoryEntity.id).toBe("string");
    },
  );

  it.each([
    [GITHUB_USERS[0].username],
    [REGISTERED_USERS[0].username],
    ["someNonExistingUser"],
  ])(
    "throws an EntityNotFoundError when fetching an non-existing username",
    async (username) => {
      expect.hasAssertions();

      try {
        await GuestUserRepository.getByUsername(username);
      } catch (err) {
        expect(err).toBeInstanceOf(EntityNotFoundError);
      }
    },
  );

  it.each([
    [REGISTERED_USERS[0].username, addDays<Date>(new Date(), 1)],
    [GITHUB_USERS[0].username, addDays<Date>(new Date(), 1)],
    ["CompletelyNewUsername_0-1", addDays<Date>(new Date(), 1)],
  ])(
    "successfully saves a new guest user with valid data",
    async (username, expiresAt) => {
      const created = await GuestUserRepository.create(username, expiresAt);

      expect(typeof created.id).toBe("string");
      expect(created.id.length).toBe(24);
      expect(created.expiresAt).toEqual(expiresAt);
      expect(created.username).toEqual(username);
      expect(created.kind).toBe(UserKind.GuestUser);

      const mongooseEntity = (await UserDbModels.User.findById(
        created.id,
      ).exec()) as object;

      expect(mongooseEntity).toMatchObject(created);
    },
  );

  it.each([
    [GUEST_USERS[0].username, addDays<Date>(new Date(), 1), "username"],
    ["", addDays<Date>(new Date(), 1), "username"],
    ["abc", addDays<Date>(new Date(), 1), "username"],
    ["abcdef!", addDays<Date>(new Date(), 1), "username"],
    ["          ", addDays<Date>(new Date(), 1), "username"],
    ["abcdef123", new Date(), "expiresAt"],
    ["abcdef123", addMinutes<Date>(new Date(), 1), "expiresAt"],
    ["abcdef123", subHours<Date>(new Date(), 1), "expiresAt"],
  ])(
    "throws a ValidationError when attempting to create a guest user with invalid data",
    async (username, expiresAt, invalidProperty) => {
      expect.hasAssertions();

      try {
        await GuestUserRepository.create(username, expiresAt);
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
