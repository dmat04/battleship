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

describe("The GuestUser mongoose model", () => {
  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoURL = mongoServer.getUri();
    await mongoose.connect(mongoURL);

    await GuestUserDbModel.create(GUEST_USERS);
    await RegisteredUserDbModel.create(REGISTERED_USERS);
    await GithubUserDbModel.create(GITHUB_USERS);
  });

  afterEach(async () => {
    await mongoServer?.stop();
  });

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
});
