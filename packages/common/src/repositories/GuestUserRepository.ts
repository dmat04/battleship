import { Error as MongooseError } from "mongoose";
import Models, {
  GuestUser,
} from "../entities/UserDbModels.js";
import { EntityNotFoundError, RepositoryError, ValidationError } from "./Errors.js";

const getAll = async (): Promise<GuestUser[]> => {
  const users = await Models.GuestUser.find({}).exec();
  return users.map((u) => u.toObject());
};

const getById = async (id: string): Promise<GuestUser> => {
  const user = await Models.GuestUser.findById(id).exec();
  
  if (!user) throw new EntityNotFoundError("GuestUser", id);
  
  return user.toObject();
};

const getByUsername = async (username: string): Promise<GuestUser> => {
  const user = await Models.GuestUser.findOne({ username }).exec();

  if (!user) throw new EntityNotFoundError("GuestUser", username);

  return user.toObject();
};

const create = async (username: string, expiresAt: Date): Promise<GuestUser> => {
  const user = new Models.GuestUser({ username, expiresAt });

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

const deleteById = async (id: string): Promise<GuestUser> => {
  const deleted = await Models.GuestUser.findByIdAndDelete(id).exec();

  if (!deleted) throw new EntityNotFoundError("GuestUser", id);

  return deleted.toObject();
};

export default {
  getAll,
  getById,
  getByUsername,
  create,
  deleteById,
};
