import { Schema } from "mongoose";
import UserDbModel, { User } from "./UserDbModel.js";

/**
 * Mongoose Model for the GuestUser type is constructed here
 */

/**
 * Interface to extend the genereci User interface
 * with the usernameExists method and the expiresAt field
 */
// TODO: take a look at https://mongoosejs.com/docs/typescript/statics-and-methods.html
export interface GuestUser extends User {
  readonly expiresAt: Date;
}

// Define the guest user schema
const guestSchema = new Schema<GuestUser>({
  expiresAt: { type: Date, required: true },
});

// Compile the GuestUserModel as a discriminated type
// on the generic User model
const GuestUserDbModel = UserDbModel.discriminator<GuestUser>(
  "GuestUser",
  guestSchema,
);

export default GuestUserDbModel;
