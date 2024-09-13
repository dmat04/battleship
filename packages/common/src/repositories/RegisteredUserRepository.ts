import { Error as MongooseError } from "mongoose";
import Models, {
  RegisteredUser,
} from "../entities/UserDbModels.js";
import { EntityNotFoundError, RepositoryError, ValidationError } from "./Errors.js";

const getAll = async (): Promise<RegisteredUser[]> => {
  const users = await Models.RegisteredUser.find({}).exec();
  return users.map((u) => u.toObject());
};

const getById = async (id: string): Promise<RegisteredUser> => {
  const user = await Models.RegisteredUser.findById(id).exec();
  
  if (!user) throw new EntityNotFoundError("RegisteredUser", id);
  
  return user.toObject();
};

const getByUsername = async (username: string): Promise<RegisteredUser> => {
  const user = await Models.RegisteredUser.findOne({ username }).exec();

  if (!user) throw new EntityNotFoundError("RegisteredUser", username);

  return user.toObject();
};

const create = async (username: string, passwordHash: string, email: string): Promise<RegisteredUser> => {
  const user = new Models.RegisteredUser({ username, passwordHash, email });

  try {
    await user.save();
    return user.toObject();
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      throw new ValidationError(err);
    } else {
      throw new RepositoryError(err);
    }
  }
};

export default {
  getAll,
  getById,
  getByUsername,
  create,
};
