import { Model, Schema, model, Types } from "mongoose";
import { User, userExists } from "@battleship/common/entities/UserDbModels.js";

export interface Session {
  readonly id: string;
  readonly user: User;
}

const sessionSchema = new Schema<Session, Model<Session>>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: (id: Types.ObjectId) => userExists(id),
      message: "No User with provided id exists",
    }
  },
});

const SessionDbModel = model<Session, Model<Session>>("Session", sessionSchema);

export default SessionDbModel;