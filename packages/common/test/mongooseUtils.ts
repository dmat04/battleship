import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import UserModel from "../src/entities/UserDbModels.js"
import { GUEST_USERS, REGISTERED_USERS, GITHUB_USERS } from "./testUsers.js";

let mongoServer: MongoMemoryServer | null = null;
let mongoURL: string | null = null;

export const setup = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoURL = mongoServer.getUri();
  await mongoose.connect(mongoURL);

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

export const teardown = async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
};