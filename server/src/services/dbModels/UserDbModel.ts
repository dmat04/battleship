import { Model, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

/**
 * Mongoose Model for the generic User type is constructed here.
 */

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

/**
 * Generic user model interface - contains only the id and a username, the other two types
 * of users are created as discriminated Models on the generic user.
 */
export interface User {
  readonly id: string;
  readonly username: string;
}

interface UserModel extends Model<User> {
  usernameExists: typeof usernameExists;
}

/**
 * Mongoose Schema for the generic User, only defines the usename property,
 * which is required, has a min length of 5, and must be unique (which is
 * ensured using the mongoose-unique-validator plugin)
 */
const userSchema = new Schema<User, UserModel>({
  username: {
    type: String,
    required: [true, "Username missing"],
    unique: true,
    minLength: [5, "Username must be at least 5 characters long"],
  },
});

// Add the usernameExists method as a static method on the userSchema
userSchema.static('usernameExists', usernameExists)

// Apply the mongoose-unique-valiator plugin
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

// Build the generic User Model
const UserDbModel = model<User, UserModel>("User", userSchema);

export default UserDbModel;
