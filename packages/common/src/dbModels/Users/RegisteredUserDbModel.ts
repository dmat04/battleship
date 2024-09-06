import { Schema } from "mongoose";
import UserDbModel, { User } from "./UserDbModel.js";

/**
 * Mongoose Model for the RegisteredUser type is constructed here
 */

/**
 * Interface to extend the generic User interface
 * with the passwordHash member
 */
export interface RegisteredUser extends User {
  readonly passwordHash: string;
}

// Define the registered user schema
const registeredSchema = new Schema<RegisteredUser>({
  passwordHash: { type: String, required: true },
});

// Compile the RegisteredUserModel as a discriminated type
// on the generic User model
const RegisteredUserDbModel = UserDbModel.discriminator<RegisteredUser>(
  "RegisteredUser",
  registeredSchema,
);

export default RegisteredUserDbModel;
