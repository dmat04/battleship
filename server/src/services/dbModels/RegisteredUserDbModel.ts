import { Schema, Model } from "mongoose";
import UserDbModel, { usernameExists } from "./UserDbModel";
import type { RegisteredUser } from "../../models/User";

/**
 * Mongoose Model for the RegisteredUser type is constructed here
 */

/**
 * Interface to extend the RegisteredUser mongoose Model interface
 * with the usernameExists method
 */
interface IRegisteredUserModel extends Model<RegisteredUser> {
  usernameExists(username: string): Promise<boolean>;
}

// Define the registered user schema
const registeredSchema = new Schema({
  passwordHash: { type: String, required: true },
});

// Add the usernameExists method as a static member to the
// registered user schema (this will make the method present in the
// constructed mongoose Model for RegisteredUser)
registeredSchema.static("usernameExists", usernameExists);

// Compile the RegisteredUserModel as a discriminated type
// on the generic User model
const RegisteredUserDbModel: IRegisteredUserModel = UserDbModel.discriminator<
  RegisteredUser,
  IRegisteredUserModel
>("RegisteredUser", registeredSchema);

export default RegisteredUserDbModel;
