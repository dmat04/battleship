import { Model, Schema, model, Types } from "mongoose";
import { User, expiresAtValidator, userExists } from "@battleship/common/entities/UserDbModels.js";

export interface Session {
  readonly id: string;
  readonly user: User;
  readonly expiresAt: Date;
}

export interface UnpopulatedSession extends Omit<Session, "user"> {
  readonly user: Types.ObjectId;
}

const toObjectOptions = {
  versionKey: false,
  flattenObjectIds: true,
  transform: (_: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
};

const sessionSchema = new Schema<Session, Model<Session>>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id: Types.ObjectId) => userExists(id),
        message: "No User with provided id exists",
      },
    },
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: expiresAtValidator,
        message: (props) => props.reason?.message ?? "{PATH} is invalid",
      }
    },
  },
  {
    toObject: toObjectOptions,
  },
);

const SessionDbModel = model<Session, Model<Session>>("Session", sessionSchema);

export default SessionDbModel;
