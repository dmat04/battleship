/* eslint-disable prefer-destructuring */
import dotenv from 'dotenv';
import { isInteger, isString } from './typeUtils';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

// Assert that the needed environment variables are present and
// of the right types
if (!isInteger(process.env.GUEST_LIFETIME_SECONDS)) {
  throw new Error(`Server configuration error: environment var 
  GUEST_LIFETIME_SECONDS missing or invalid`);
}

if (!isInteger(process.env.PORT)) {
  throw new Error(`Server configuration error: environment var 
  PORT missing or invalid`);
}

if (!isString(process.env.JWT_SECRET)) {
  throw new Error(`Server configuration error: environment var 
  JWT_SECRET missing or invalid`);
}

if (!isString(process.env.MONGODB_URI)) {
  throw new Error(`Server configuration error: environment var 
  MONGODB_URI missing or invalid`);
}

if (!isInteger(process.env.PWD_HASH_SALT_ROUNDS)) {
  throw new Error(`Server configuration error: environment var 
  PWD_HASH_SALT_ROUNDS missing or invalid`);
}

// After asserting the types of the env variables, save them as members
const GUEST_LIFETIME_SECONDS: number = Number.parseInt(process.env.GUEST_LIFETIME_SECONDS, 10);
const JWT_SECRET: string = process.env.JWT_SECRET;
const PORT: number = Number.parseInt(process.env.PORT, 10);
const MONGODB_URI = process.env.MONGODB_URI;
const PWD_HASH_SALT_ROUNDS = Number.parseInt(process.env.PWD_HASH_SALT_ROUNDS, 10);

export default {
  GUEST_LIFETIME_SECONDS,
  JWT_SECRET,
  PORT,
  MONGODB_URI,
  PWD_HASH_SALT_ROUNDS,
};
