import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserModel, { GithubUser, GuestUser, RegisteredUser } from "./UserDbModels.js";
import {
  GUEST_USERS,
  REGISTERED_USERS,
  GITHUB_USERS,
} from "../../test/testUsers.js";
import SessionDbModel from "./SessionDbModel.js";

let mongoServer: MongoMemoryServer | null = null;
let mongoURL: string | null = null;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoURL = mongoServer.getUri();
  await mongoose.connect(mongoURL);

  const modelInitPromises = [
    UserModel.Guest.init(),
    UserModel.Registered.init(),
    UserModel.Github.init(),
    SessionDbModel.init(),
  ];
  await Promise.all(modelInitPromises);

  const dataInitPromises = [
    UserModel.Guest.create(GUEST_USERS),
    UserModel.Registered.create(REGISTERED_USERS),
    UserModel.Github.create(GITHUB_USERS),
  ];
  await Promise.all(dataInitPromises);
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

describe("The Session mongoose model", () => {
  it("saves a session document successfully for a guest user", async () => {
    const user = await UserModel.Guest.findOne({ username: GUEST_USERS[0].username }) as GuestUser;

    await SessionDbModel.create({ user: user.id });

    const session = await SessionDbModel.findOne({ user: user.id });
    await session?.populate("user");

    expect(session?.id).toBeDefined;
    expect(session?.user).toMatchObject(user);
  });

  it("saves a session document successfully for a regiestered user", async () => {
    const user = await UserModel.Registered.findOne({ username: REGISTERED_USERS[0].username }) as RegisteredUser;

    await SessionDbModel.create({ user: user.id });

    const session = await SessionDbModel.findOne({ user: user.id });
    await session?.populate("user");

    expect(session?.id).toBeDefined;
    expect(session?.user).toMatchObject(user);
  });

  it("saves a session document successfully for a github user", async () => {
    const user = await UserModel.Github.findOne({ username: GITHUB_USERS[0].username }) as GithubUser;

    await SessionDbModel.create({ user: user.id });

    const session = await SessionDbModel.findOne({ user: user.id });
    await session?.populate("user");

    expect(session?.id).toBeDefined;
    expect(session?.user).toMatchObject(user);
  });

  it("allows saving multiple sessions for a single user", async () => {
    const user = await UserModel.Github.findOne({ username: GITHUB_USERS[0].username }) as GithubUser;

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