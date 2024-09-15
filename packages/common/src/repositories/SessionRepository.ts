import mongoose, { Error as MongooseError } from "mongoose";
import SessionDbModel, { Session, UnpopulatedSession } from "../entities/SessionDbModel.js";
import { EntityNotFoundError, RepositoryError, ValidationError } from "./Errors.js";

const getById = async (id: string): Promise<UnpopulatedSession> => {
  const session = await SessionDbModel.findById(id).exec();

  if (!session) throw new EntityNotFoundError("User", id);

  return session.toObject();
};

const getByIdPopulated = async (id: string): Promise<Session> => {
  const session = await SessionDbModel.findById(id).exec();

  if (!session) throw new EntityNotFoundError("User", id);

  try {
    await session.populate("user");
  } catch {
    throw new EntityNotFoundError(
      "User",
      (session.user as unknown as mongoose.Types.ObjectId).toString(),
    );
  }

  return session.toObject();
};

const create = async (userId: string, expiresAt: Date): Promise<Session> => {
  const session = new SessionDbModel({ user: userId, expiresAt });

  try {
    await session.save();
    await session.populate("user");
    return session.toObject();
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      throw new ValidationError(err);
    } else {
      throw new RepositoryError(err);
    }
  }
}

const deleteById = async (sessionId: string): Promise<UnpopulatedSession> => {
  const deleted = await SessionDbModel.findByIdAndDelete(sessionId).exec();
  
  if (!deleted) throw new EntityNotFoundError("Session", sessionId);
  
  return deleted.toObject();
};

const deleteAllForUser = async (userId: string): Promise<number> => {
  const result = await SessionDbModel.deleteMany({ user: userId }).exec();
  
  return result.deletedCount;
};

export default {
  getById,
  getByIdPopulated,
  create,
  deleteById,
  deleteAllForUser,
};
