import { Error as MongooseError } from "mongoose";
import Models, {
  GithubUser,
} from "../entities/UserDbModels.js";
import { EntityNotFoundError, RepositoryError, ValidationError } from "./Errors.js";

const getAll = async (): Promise<GithubUser[]> => {
  const users = await Models.GithubUser.find({}).exec();
  return users.map((u) => u.toObject());
};

const getById = async (id: string): Promise<GithubUser> => {
  const user = await Models.GithubUser.findById(id).exec();
  
  if (!user) throw new EntityNotFoundError("GithubUser", id);
  
  return user.toObject();
};

const getByUsername = async (username: string): Promise<GithubUser> => {
  const user = await Models.GithubUser.findOne({ username }).exec();

  if (!user) throw new EntityNotFoundError("GithubUser", username);

  return user.toObject();
};

const create = async (username: string, githubId: string, refreshToken: string): Promise<GithubUser> => {
  const user = new Models.GithubUser({ username, githubId, refreshToken });

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
