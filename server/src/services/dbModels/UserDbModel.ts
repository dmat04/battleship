import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import type { User } from "../../models/User";

/**
 * Mongoose Model for the generic User type is constructed here.
 */

/**
 * Mongoose Schema for the generic User, only defines the usename property,
 * which is required, has a min length of 5, and must be unique (which is
 * ensured using the mongoose-unique-validator plugin)
 */
const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, "Username missing"],
    unique: true,
    minLength: [5, "Username must be at least 5 characters long"],
  },
});

// Apply the mongoose-unique-valiator plugin
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

// Build the generic User Model
const UserDbModel = model<User>("User", userSchema);

/**
 * Method to check if a User document exists with a given username.
 * This method is added as a static member to each of the two user
 * Model types.
 *
 * @param username The username to be searched for.
 * @returns true if a User exists with the given username, false otherwise.
 */
// eslint-disable-next-line arrow-body-style
export const usernameExists = async (username: string): Promise<boolean> => {
  return (await UserDbModel.exists({ username })) !== null;
};

export default UserDbModel;
