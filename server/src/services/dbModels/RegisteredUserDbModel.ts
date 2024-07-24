import { Schema } from "mongoose";
import UserDbModel, { User } from "./UserDbModel.js";

/**
 * Mongoose Model for the RegisteredUser type is constructed here
 */

/**
 * Interface to extend the generic User interface
 * with the usernameExists method and passwordHash member
 */
// TODO: take a look at https://mongoosejs.com/docs/typescript/statics-and-methods.html

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
