import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserModel from "../src/entities/UserDbModels.js"
import SessionModel from "../src/entities/SessionDbModel.js";
import { GUEST_USERS, REGISTERED_USERS, GITHUB_USERS } from "./testUsers.js";
import { addDays } from "date-fns";

let mongoServer: MongoMemoryServer | null = null;
let mongoURL: string | null = null;

export const setupConnection = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoURL = mongoServer.getUri();
  await mongoose.connect(mongoURL);
}

export const setupUsers = async () => {
  const modelInitPromises = [
    UserModel.User.init(),
    UserModel.GuestUser.init(),
    UserModel.RegisteredUser.init(),
    UserModel.GithubUser.init(),
  ];
  await Promise.all(modelInitPromises);

  const dataInitPromises = [
    UserModel.GuestUser.create(GUEST_USERS),
    UserModel.RegisteredUser.create(REGISTERED_USERS),
    UserModel.GithubUser.create(GITHUB_USERS),
  ];
  await Promise.all(dataInitPromises);
};

export const setupSessions = async (sessionsPerUser: number) => {
  await SessionModel.init();
  const users = await UserModel.User.find({}).exec();

  const createPromises: Promise<unknown>[] = []

  users.forEach(({ _id }) => {
    const documents = new Array(sessionsPerUser);
    documents.fill({ user: _id, expiresAt: addDays(new Date(), 1) });
    createPromises.push(SessionModel.create(documents));
  });

  await Promise.all(createPromises);
}

export const teardownConnection = async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
};