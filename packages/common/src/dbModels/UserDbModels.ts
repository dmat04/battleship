import { Model, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

/**
 * Enum of User account types
 */
export enum UserKind {
  GuestUser = "GUEST_USER",
  RegisteredUser = "REGISTERED_USER",
  GithubUser = "GITHUB_USER",
}

/**
 * Document interface base
 */
interface User {
  readonly id: string;
  readonly username: string;
  readonly kind: UserKind;
}

/**
 * GuestUser document interface
 */
export interface GuestUser extends User {
  readonly kind: UserKind.GuestUser;
  readonly expiresAt: Date;
}

/**
 * RegisteredUser document interface
 */
export interface RegisteredUser extends User {
  readonly kind: UserKind.RegisteredUser;
  readonly passwordHash: string;
  readonly email: string;
  readonly emailConfirmed: boolean;
}

/**
 * GithubUser document interface
 */
export interface GithubUser extends User {
  readonly kind: UserKind.GithubUser;
  readonly githubId: string;
  readonly refreshToken: string;
}

type UsernameChecker = (username: string, kind: UserKind) => Promise<boolean>;

/**
 * Method to check if a User document exists with a given username.
 * This method is added as a static member to each of the two user
 * Model types.
 *
 * @param username The username to be searched for.
 * @returns true if a User exists with the given username, false otherwise.
 */
// eslint-disable-next-line arrow-body-style
export const usernameExists: UsernameChecker = async (
  username: string,
  kind: UserKind,
): Promise<boolean> => {
  return (await UserDbModel.exists({ username, kind })) !== null;
};

/**
 * Mongoose Model interfaces
 */
interface UserModel extends Model<User> {
  usernameExists: UsernameChecker;
}

export interface GuestUserModel extends Model<GuestUser> {
  usernameExists: UsernameChecker;
}

export interface RegisteredUserModel extends Model<RegisteredUser> {
  usernameExists: UsernameChecker;
}

export interface GithubUserModel extends Model<GithubUser> {
  usernameExists: UsernameChecker;
}

// Define options for the base user schema, specifies the property
// name ("kind") to be used as the discriminator type property
const baseSchemaOptions = { 
  discriminatorKey: "kind",
};

/**
 * Mongoose Schema for the generic User, only defines the usename property.
 */
const userSchema = new Schema<User, UserModel>(
  {
    username: {
      type: String,
      required: [true, "Username missing"],
      immutable: true,
      trim: true,
      minLength: [5, "Username must be at least 5 characters long"],
      match: /[\w\d-]+/,
    },
  },
  baseSchemaOptions,
);

// Create a compound unique index on the username and kind fields
// (ensures usernames are unique per user-kind).
userSchema.index({ username: 1, kind: 1 }, { unique: true });

// Add the usernameExists method as a static method on the userSchema
userSchema.static("usernameExists", usernameExists);

// Apply the mongoose-unique-valiator plugin
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

// Define the schema for the Guest user specific fields
const guestUserSchema = new Schema<GuestUser, GuestUserModel>({
  expiresAt: { type: Date, required: true },
});

// Define the schema for the Registered user specific fields
const registeredUserSchema = new Schema<RegisteredUser, RegisteredUserModel>({
  passwordHash: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email address missing"],
    unique: true,
    match: /^\S+@\S+$/,
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Define the schema for the Github user specific fields
const githubUserSchema = new Schema<GithubUser, GithubUserModel>({
  githubId: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true },
});

// Build the generic User model, keep it private
const UserDbModel = model<User, UserModel>("User", userSchema);

// Build the Guest user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
export const GuestUserDbModel = UserDbModel.discriminator<
  GuestUser,
  GuestUserModel
>(UserKind.GuestUser, guestUserSchema, {
  value: UserKind.GuestUser,
});

// Build the Registered user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
export const RegisteredUserDbModel = UserDbModel.discriminator<
  RegisteredUser,
  RegisteredUserModel
>(UserKind.RegisteredUser, registeredUserSchema, {
  value: UserKind.RegisteredUser,
});

// Build the Github user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
export const GithubUserDbModel = UserDbModel.discriminator<
  GithubUser,
  GithubUserModel
>(UserKind.GithubUser, githubUserSchema, {
  value: UserKind.GithubUser,
});
