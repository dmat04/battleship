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

const toObjectOptions = {
  versionKey: false,
  flattenObjectIds: true,
  transform: (_: unknown, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
};

const USERNAME_MIN_LENGTH = 5;
const USERNAME_REGEX = new RegExp(/^[\w\d-]+$/);

export const usernameValidator = (username: string) => {
  if (username.length < USERNAME_MIN_LENGTH) {
    throw new Error(`Username must contain at least ${USERNAME_MIN_LENGTH} characters`)
  }

  if (!USERNAME_REGEX.test(username)) {
    throw new Error("Username may only contain alphanumeric characters, '_' or '-'");
  }

  return true;
}

/**
 * Mongoose Schema for the generic User, only defines the usename property.
 */
const userSchema = new Schema<User, Model<User>>(
  {
    username: {
      type: String,
      required: [true, "Username missing"],
      immutable: true,
      trim: true,
      validate: {
        validator: usernameValidator,
        message: "Username is to short or contains prohibited characters",
      },
    },
  },
  {
    discriminatorKey: "kind",
    toObject: toObjectOptions,
  },
);

// Create a compound unique index on the username and kind fields
// (ensures usernames are unique per user-kind).
userSchema.index({ username: 1, kind: 1 }, { unique: true });

// Define the schema for the Guest user specific fields
const guestUserSchema = new Schema<GuestUser, Model<GuestUser>>(
  {
    expiresAt: { type: Date, required: true },
  },
  {
    toObject: toObjectOptions,
  },
);

// Define the schema for the Registered user specific fields
const registeredUserSchema = new Schema<RegisteredUser, Model<RegisteredUser>>(
  {
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
  },
  {
    toObject: toObjectOptions,
  },
);

// Define the schema for the Github user specific fields
const githubUserSchema = new Schema<GithubUser, Model<GithubUser>>(
  {
    githubId: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true },
  },
  {
    toObject: toObjectOptions,
  },
);

// Apply the mongoose-unique-valiator plugin to each Schema
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
guestUserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });
registeredUserSchema.plugin(uniqueValidator, {
  message: "{PATH} must be unique",
});
githubUserSchema.plugin(uniqueValidator, { message: "{PATH} must be unique" });

// Build the generic User model, keep it private
const UserDbModel = model<User, Model<User>>("User", userSchema);

// Build the Guest user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
const GuestUserDbModel = UserDbModel.discriminator<GuestUser, Model<GuestUser>>(
  UserKind.GuestUser,
  guestUserSchema,
  {
    value: UserKind.GuestUser,
  },
);

// Build the Registered user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
const RegisteredUserDbModel = UserDbModel.discriminator<
  RegisteredUser,
  Model<RegisteredUser>
>(UserKind.RegisteredUser, registeredUserSchema, {
  value: UserKind.RegisteredUser,
});

// Build the Github user model as a discriminated model on the generic User model,
// passing the appropriate value for the discriminator property ("kind").
const GithubUserDbModel = UserDbModel.discriminator<
  GithubUser,
  Model<GithubUser>
>(UserKind.GithubUser, githubUserSchema, {
  value: UserKind.GithubUser,
});

export const userIdExists = async (id: Schema.Types.ObjectId) => {
  return (await UserDbModel.findById(id).exec()) !== null;
};

export const findUserById = (id: string) => {
  return UserDbModel.findById(id).exec();
};

export default {
  User: UserDbModel,
  GuestUser: GuestUserDbModel,
  RegisteredUser: RegisteredUserDbModel,
  GithubUser: GithubUserDbModel,
};
