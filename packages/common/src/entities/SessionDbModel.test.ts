import { describe, expect, it, beforeEach, afterEach, assert } from "vitest";
import mongoose from "mongoose";
import { addDays, addMinutes, subHours } from "date-fns";
import Model, {
  GithubUser,
  GuestUser,
  RegisteredUser,
} from "./UserDbModels.js";
import {
  setupConnection,
  teardownConnection,
  setupUsers,
} from "../../test/mongooseUtils.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
} from "../../test/testUsers.js";
import SessionDbModel from "./SessionDbModel.js";
import UserDbModels from "./UserDbModels.js";

beforeEach(async () => {
  await setupConnection();
  await setupUsers();
});

afterEach(async () => {
  await teardownConnection();
});

describe("The Session mongoose model", () => {
  it("saves a session document successfully for a guest user", async () => {
    const user = (await Model.GuestUser.findOne({
      username: GUEST_USERS[0].username,
    })) as GuestUser;

    await SessionDbModel.create({
      user: user.id,
      expiresAt: addDays(new Date(), 1),
    });

    const session = await SessionDbModel.findOne({ user: user.id });
    assert(session)
    expect(session.id).toBeDefined;

    expect(session.user).toBeInstanceOf(mongoose.Types.ObjectId);
    await session.populate("user");
    expect(session.user).toMatchObject(user);
  });

  it("saves a session document successfully for a regiestered user", async () => {
    const user = (await Model.RegisteredUser.findOne({
      username: REGISTERED_USERS[0].username,
    })) as RegisteredUser;

    await SessionDbModel.create({
      user: user.id,
      expiresAt: addDays(new Date(), 1),
    });

    const session = await SessionDbModel.findOne({ user: user.id });
    assert(session)
    expect(session.id).toBeDefined;

    expect(session.user).toBeInstanceOf(mongoose.Types.ObjectId);
    await session.populate("user");
    expect(session.user).toMatchObject(user);
  });

  it("saves a session document successfully for a github user", async () => {
    const user = (await Model.GithubUser.findOne({
      username: GITHUB_USERS[0].username,
    })) as GithubUser;

    await SessionDbModel.create({
      user: user.id,
      expiresAt: addDays(new Date(), 1),
    });

    const session = await SessionDbModel.findOne({ user: user.id });
    assert(session)
    expect(session.id).toBeDefined;

    expect(session.user).toBeInstanceOf(mongoose.Types.ObjectId);
    await session.populate("user");
    expect(session.user).toMatchObject(user);
  });

  it("allows saving multiple sessions for a single user", async () => {
    const user = (await Model.GithubUser.findOne({
      username: GITHUB_USERS[0].username,
    })) as GithubUser;

    await SessionDbModel.create({
      user: user.id,
      expiresAt: addDays(new Date(), 1),
    });
    await SessionDbModel.create({
      user: user.id,
      expiresAt: addDays(new Date(), 1),
    });
    await SessionDbModel.create({
      user: user.id,
      expiresAt: addDays(new Date(), 1),
    });

    const count = await SessionDbModel.countDocuments({ user: user.id });

    expect(count).eq(3);
  });

  it.each([[""], [new mongoose.Types.ObjectId()], [undefined]])(
    "will not create a session document without a valid user id",
    async (id) => {
      await expect(
        SessionDbModel.create({ user: id, expiresAt: addDays(new Date(), 1) }),
      ).rejects.toThrowError("validation");
    },
  );

  it.each([
    [new Date()],
    [addMinutes<Date>(new Date(), 1)],
    [subHours<Date>(new Date(), 1)],
  ])(
    "will not create a session document with an invalid expiration date",
    async (expiresAt) => {
      const user = await UserDbModels.RegisteredUser.findOne({}).exec();

      assert(user)

      await expect(
        SessionDbModel.create({ user: user._id.toString(), expiresAt }),
      ).rejects.toThrowError("validation");
    },
  );
});
