import { describe, expect, it, beforeEach, afterEach, assert } from "vitest";
import mongoose from "mongoose";
import UserDbModels from "../entities/UserDbModels.js";
import {
  setupConnection,
  teardownConnection,
  setupUsers,
  setupSessions,
} from "../../test/mongooseUtils.js";
import { ALL_USERS } from "../../test/testUsers.js";
import SessionDbModel from "../entities/SessionDbModel.js";
import SessionRepository from "./SessionRepository.js";
import { EntityNotFoundError, ValidationError } from "./Errors.js";
import { addDays, addHours, addMinutes, subHours, subMinutes } from "date-fns";

const SESSIONS_PER_USER = 2;

beforeEach(async () => {
  await setupConnection();
  await setupUsers();
  await setupSessions(SESSIONS_PER_USER);
});

afterEach(async () => {
  await teardownConnection();
});

describe("The SessionRepository", () => {
  it.each([...ALL_USERS])(
    "successfully retrieves a populated Session using a valid session id",
    async (user) => {
      const userDocument = await UserDbModels.User.findOne({
        username: user.username,
        kind: user.kind,
      }).exec();

      assert(userDocument);

      const plainUser = userDocument?.toObject();
      const sessionDocuments = await SessionDbModel.find({
        user: userDocument._id,
      }).exec();
      expect(sessionDocuments.length).toEqual(SESSIONS_PER_USER);

      for (const sessionDocument of sessionDocuments) {
        const session = await SessionRepository.getById(
          sessionDocument._id.toString(),
        );
        expect(session.id).toEqual(sessionDocument._id.toString());
        expect(session.user).toMatchObject(plainUser);
      }
    },
  );

  it("throws an EntityNotFoundError when retrieving a non-existing session id", async () => {
    expect.hasAssertions();

    const id = new mongoose.Types.ObjectId();
    try {
      await SessionRepository.getById(id.toString());
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
    }
  });

  it.each([...ALL_USERS])(
    "successfully creates a new Session for an existing User",
    async (user) => {
      const userDocument = await UserDbModels.User.findOne({
        username: user.username,
        kind: user.kind,
      }).exec();
      const countBefore = await SessionDbModel.countDocuments().exec();

      assert(userDocument);
      const plainUser = userDocument.toObject();

      const session = await SessionRepository.create(
        plainUser.id,
        addHours(new Date(), 2),
      );
      expect(typeof session.id).toBe("string");
      expect(session.user).toMatchObject(plainUser);

      const countAfter = await SessionDbModel.countDocuments().exec();
      expect(countAfter).toBe(countBefore + 1);
    },
  );

  it.each([[new mongoose.Types.ObjectId().toString()], [""]])(
    "throws a ValidationError when creating a Session for an invalid user id",
    async (user) => {
      expect.hasAssertions();

      try {
        await SessionRepository.create(user, addDays(new Date(), 1));
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        const validationError = err as ValidationError;
        expect(validationError.invalidProperties).toHaveProperty("user");
        expect(validationError.message).toMatch("validation");
      }
    },
  );

  it.each([
    [new Date()],
    [addMinutes<Date>(new Date(), 1)],
    [subMinutes<Date>(new Date(), 1)],
    [subHours<Date>(new Date(), 1)],
  ])(
    "throws a ValidationError when creating a Session with an invalid expiration time",
    async (expiresAt) => {
      expect.hasAssertions();

      const user = (await UserDbModels.User.findOne({}).exec())?._id.toString() ?? "";

      try {
        await SessionRepository.create(user, expiresAt);
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
        const validationError = err as ValidationError;
        expect(validationError.invalidProperties).toHaveProperty("expiresAt");
        expect(validationError.message).toMatch("validation");
      }
    },
  );

  it.each([...ALL_USERS])(
    "successfully deletes a Session using a valid session id",
    async (user) => {
      const userDocument = await UserDbModels.User.findOne({
        username: user.username,
        kind: user.kind,
      }).exec();

      assert(userDocument);

      const countBefore = await SessionDbModel.countDocuments().exec();
      const sessionDocuments = await SessionDbModel.find({
        user: userDocument._id,
      }).exec();
      expect(sessionDocuments.length).toEqual(SESSIONS_PER_USER);

      for (const sessionDocument of sessionDocuments) {
        const deleted = await SessionRepository.deleteById(
          sessionDocument._id.toString(),
        );
        expect(deleted.id).toEqual(sessionDocument._id.toString());
        expect(deleted.user).toEqual(userDocument._id.toString());
      }

      const countAfter = await SessionDbModel.countDocuments().exec();
      expect(countAfter).toBe(countBefore - SESSIONS_PER_USER);
    },
  );

  it.each([...ALL_USERS])(
    "successfully deletes all Sessions for some existing user",
    async (user) => {
      const userDocument = await UserDbModels.User.findOne({
        username: user.username,
        kind: user.kind,
      }).exec();

      assert(userDocument);

      const countBefore = await SessionDbModel.countDocuments().exec();

      const deletedCount = await SessionRepository.deleteAllForUser(
        userDocument._id.toString(),
      );
      expect(deletedCount).toBe(SESSIONS_PER_USER);

      const countAfter = await SessionDbModel.countDocuments().exec();
      expect(countAfter).toBe(countBefore - SESSIONS_PER_USER);
    },
  );

  it("returns a count of 0 when deleting all sessions of a non-existing user", async () => {
    const id = new mongoose.Types.ObjectId();
    const countBefore = await SessionDbModel.countDocuments().exec();

    const deletedCount = await SessionRepository.deleteAllForUser(
      id.toString(),
    );
    expect(deletedCount).toBe(0);

    const countAfter = await SessionDbModel.countDocuments().exec();
    expect(countAfter).toBe(countBefore);
  });
});
