import Models, {
  User,
  UserKind,
  usernameValidator,
} from "../entities/UserDbModels.js";
import { EntityNotFoundError } from "./Errors.js";

const getAll = async (): Promise<User[]> => {
  const users = await Models.User.find({}).exec();
  return users.map((u) => u.toObject());
};

const getById = async (id: string): Promise<User> => {
  const user = await Models.User.findById(id).exec();

  if (!user) throw new EntityNotFoundError("User", id);

  return user.toObject();
};

const getByUsernameAndKind = async (
  username: string,
  kind: UserKind,
): Promise<User | undefined> => {
  const user = await Models.User.findOne({
    username,
    kind,
  }).exec();

  if (!user) throw new EntityNotFoundError("User", `${kind}:${username}`);
  
  return user.toObject();
};

const validateUsername = (username: string): string | undefined => {
  try {
    usernameValidator(username);
    return undefined;
  } catch (err) {
    if (err instanceof Error) return err.message;
    return "Username invalid";
  }
};

const usernameAvailable = async (
  username: string,
  kind: UserKind,
): Promise<boolean> => {
  const user = await Models.User.findOne({ username, kind }).exec();
  return user === null;
};

export default {
  getAll,
  getById,
  getByUsernameAndKind,
  validateUsername,
  usernameAvailable,
};