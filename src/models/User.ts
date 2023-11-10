import { Schema, model, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Mongoose Models for the two User types (guest and registered) are defined here.
 */

/**
 * Generic user model interface - contains only the username, the other two types
 * of users are created as discriminated Models on the generic user.
 */
interface User {
  readonly username: string;
}

/**
 * Mongoose Schema for the generic User, only defines the usename property,
 * which is required, has a min length of 5, and must be unique (which is
 * ensured using the mongoose-unique-validator plugin)
 */
const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, 'Username missing'],
    unique: true,
    minLength: [5, 'Username must be at least 5 characters long']
  }
});

// Apply the mongoose-unique-valiator plugin
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

// Build the generic User Model
const userModel = model<User>('User', userSchema);

/**
 * Method to check if a User document exists with a given username.
 * This method is added as a static member to each of the two user
 * Model types.
 * 
 * @param username The username to be searched for.
 * @returns true if a User exists with the given username, false otherwise.
 */
const usernameExists = async (username: string): Promise<boolean> => {
  return (await userModel.exists({ username })) !== null
}

/**
 * Registered User schema interface
 */
export interface RegisteredUser extends User {
  passwordHash: string;
}

/**
 * Guest User schema interface
 */
export interface GuestUser extends User {
  readonly expiresAt: Date;
}

/**
 * Interface to extend the RegisteredUser mongoose Model interface
 * with the usernameExists method
 */
export interface IRegisteredUserModel extends Model<RegisteredUser> {
  usernameExists(username: string): Promise<boolean>
}

/**
 * Interface to extend the GuestUser mongoose Model interface
 * with the usernameExists method
 */
export interface IGuestUserModel extends Model<GuestUser> {
  usernameExists(username: string): Promise<boolean>
}

// Define the guest user schema 
const guestSchema = new Schema({
  expiresAt: { type: Date, required: true },
});

// Define the registered user schema
const registeredSchema = new Schema({
  passwordHash: { type: String, required: true },
});

// Add the usernameExists method as a static member to the 
// schemas (this will make the method present in the respective
// mongoose Model classes)
guestSchema.static('usernameExists', usernameExists);
registeredSchema.static('usernameExists', usernameExists)

// Compile the RegisteredUserModel as a discriminated type 
// on the generic User model
export const RegisteredUserModel: IRegisteredUserModel =
  userModel.discriminator<RegisteredUser, IRegisteredUserModel>(
    'RegisteredUser',
    registeredSchema,
  );

// Compile the GuestUserModel as a discriminated type 
// on the generic User model
export const GuestUserModel: IGuestUserModel =
  userModel.discriminator<GuestUser, IGuestUserModel>(
    'GuestUser',
    guestSchema,
  );
