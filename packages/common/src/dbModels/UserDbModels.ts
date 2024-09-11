import { Model, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

/**
 * Enum of User account types
 */
export enum UserKind {
  GuestUser = "GuestUser",
  RegisteredUser = "RegisteredUser",
  GithubUser = "GithubUser",
}

/**
 * Document interface base
 */
export interface User {
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  emailConfirmed: Boolean;
}

/**
 * GithubUser document interface
 */
export interface GithubUser extends User {
  readonly kind: UserKind.GithubUser;
  readonly githubId: string;
  readonly refreshToken: string;
}

/**
 * Method to check if a User document exists with a given username.
 * This method is added as a static member to each of the two user
 * Model types.
 *
 * @param username The username to be searched for.
 * @returns true if a User exists with the given username, false otherwise.
 */
// eslint-disable-next-line arrow-body-style
const usernameExists = async (
  username: string,
  kind: UserKind,
): Promise<boolean> => {
  return (await UserDbModel.exists({ username, kind })) !== null;
};

/**
 * Mongoose Model interfaces
 */
interface UserModel extends Model<User> {
  usernameExists: (username: string, kind: UserKind) => Promise<boolean>;
}

export interface GuestUserModel extends Model<GuestUser> {
  usernameExists: (username: string) => Promise<boolean>;
}

export interface RegisteredUserModel extends Model<RegisteredUser> {
  usernameExists: (username: string) => Promise<boolean>;
}

export interface GithubUserModel extends Model<GithubUser> {
  usernameExists: (username: string) => Promise<boolean>;
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
      match: /^[\w\d-]+$/,
    },
  },
  baseSchemaOptions,
);

// Create a compound unique index on the username and kind fields
// (ensures usernames are unique per user-kind).
userSchema.index({ username: 1, kind: 1 }, { unique: true });

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
    default: false,
  },
});

// Define the schema for the Github user specific fields
const githubUserSchema = new Schema<GithubUser, GithubUserModel>({
  githubId: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true },
});

// Add the usernameExists method as a static methods each Schema
userSchema.static("usernameExists", usernameExists);
guestUserSchema.static("usernameExists", async (username: string) =>
  usernameExists(username, UserKind.GuestUser),
);
registeredUserSchema.static("usernameExists", async (username: string) =>
  usernameExists(username, UserKind.RegisteredUser),
);
githubUserSchema.static("usernameExists", async (username: string) =>
  usernameExists(username, UserKind.GithubUser),
);

// Apply the mongoose-unique-valiator plugin to each Schema
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
guestUserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
registeredUserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
githubUserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

// Build the generic User model, keep it private
const UserDbModel = model<User, UserModel>("User", userSchema);

// Build the Guest user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
const GuestUserDbModel = UserDbModel.discriminator<
  GuestUser,
  GuestUserModel
>(UserKind.GuestUser, guestUserSchema, {
  value: UserKind.GuestUser,
});

// Build the Registered user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
const RegisteredUserDbModel = UserDbModel.discriminator<
  RegisteredUser,
  RegisteredUserModel
>(UserKind.RegisteredUser, registeredUserSchema, {
  value: UserKind.RegisteredUser,
});

// Build the Github user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
const GithubUserDbModel = UserDbModel.discriminator<
  GithubUser,
  GithubUserModel
>(UserKind.GithubUser, githubUserSchema, {
  value: UserKind.GithubUser,
});

export const userIdExists = async (id: Schema.Types.ObjectId) => {
  return (await UserDbModel.findById(id).exec()) !== null;
}

export default {
  Guest: GuestUserDbModel,
  Registered: RegisteredUserDbModel,
  Github: GithubUserDbModel,
};
