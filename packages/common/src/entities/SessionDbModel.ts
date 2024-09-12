import { Model, Schema, model } from "mongoose";
import { User, userIdExists } from "@battleship/common/entities/UserDbModels.js";

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
      validator: (id: Schema.Types.ObjectId) => userIdExists(id),
      message: "No User with provided id exists",
    }
  },
});

const SessionDbModel = model<Session, Model<Session>>("Session", sessionSchema);

export default SessionDbModel;