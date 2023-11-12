import { Schema, Model } from 'mongoose';
import { GuestUser } from '../../models/User';
import UserDbModel, { usernameExists } from './UserDbModel';

/**
 * Mongoose Model for the GuestUser type is constructed here
 */

/**
 * Interface to extend the GuestUser mongoose Model interface
 * with the usernameExists method
 */
interface IGuestUserModel extends Model<GuestUser> {
  usernameExists(username: string): Promise<boolean>
}

// Define the guest user schema
const guestSchema = new Schema({
  expiresAt: { type: Date, required: true },
});

// Add the usernameExists method as a static member to the
// guest user schema (this will make the method present in the constructed
// mongoose Model for GuestUser)
guestSchema.static('usernameExists', usernameExists);

// Compile the GuestUserModel as a discriminated type
// on the generic User model
const GuestUserDbModel: IGuestUserModel = UserDbModel
  .discriminator<GuestUser, IGuestUserModel>(
  'GuestUser',
  guestSchema,
);

export default GuestUserDbModel;
