import { describe, expect, it, beforeEach, afterEach } from "vitest";
import mongoose from "mongoose";
import Model, { GithubUser, GuestUser, RegisteredUser } from "./UserDbModels.js";
import { setup, teardown } from "../../test/mongooseUtils.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
} from "../../test/testUsers.js";
import SessionDbModel from "./SessionDbModel.js";

beforeEach(async () => {
  await setup();
});

afterEach(async () => {
  await teardown();
});

describe("The Session mongoose model", () => {
  it("saves a session document successfully for a guest user", async () => {
    const user = await Model.GuestUser.findOne({ username: GUEST_USERS[0].username }) as GuestUser;

    await SessionDbModel.create({ user: user.id });

    const session = await SessionDbModel.findOne({ user: user.id });
    await session?.populate("user");

    expect(session?.id).toBeDefined;
    expect(session?.user).toMatchObject(user);
  });

  it("saves a session document successfully for a regiestered user", async () => {
    const user = await Model.RegisteredUser.findOne({ username: REGISTERED_USERS[0].username }) as RegisteredUser;

    await SessionDbModel.create({ user: user.id });

    const session = await SessionDbModel.findOne({ user: user.id });
    await session?.populate("user");

    expect(session?.id).toBeDefined;
    expect(session?.user).toMatchObject(user);
  });

  it("saves a session document successfully for a github user", async () => {
    const user = await Model.GithubUser.findOne({ username: GITHUB_USERS[0].username }) as GithubUser;

    await SessionDbModel.create({ user: user.id });

    const session = await SessionDbModel.findOne({ user: user.id });
    await session?.populate("user");

    expect(session?.id).toBeDefined;
    expect(session?.user).toMatchObject(user);
  });

  it("allows saving multiple sessions for a single user", async () => {
    const user = await Model.GithubUser.findOne({ username: GITHUB_USERS[0].username }) as GithubUser;

    await SessionDbModel.create({ user: user.id });
    await SessionDbModel.create({ user: user.id });
    await SessionDbModel.create({ user: user.id });

    const count = await SessionDbModel.countDocuments({ user: user.id });
    
    expect(count).eq(3);
  });

  it.each([
    "",
    new mongoose.Types.ObjectId(),
    undefined,
  ])("will not create a session document without a valid user id", async (id) => {
    await expect(SessionDbModel.create({ user: id })).rejects.toThrowError("validation")
  });
});