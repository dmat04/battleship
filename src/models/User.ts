import mongoose, { model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface Username {
  readonly username: string;
}

export interface RegisteredUser extends Username {
  passwordHash: string;
}

export interface GuestUser extends Username {
  readonly expiresAt: Date
}

const UsernameSchema = new mongoose.Schema<Username>({
  username: {
    type: String,
    required: [true, 'Username missing'],
    unique: true,
    minLength: [5, 'Username must be at least 5 characters long']
  }
});

UsernameSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

const usernameModel = model<Username>('Username', UsernameSchema);

export const RegisteredUserModel = usernameModel.discriminator<RegisteredUser>(
  'RegisteredUser',
  new mongoose.Schema({
    passwordHash: { type: String, required: true },
  }),
);

export const GuestUserModel = usernameModel.discriminator<GuestUser>(
  'GuestUser',
  new mongoose.Schema({
    expiresAt: { type: Date, required: true },
  }),
);
