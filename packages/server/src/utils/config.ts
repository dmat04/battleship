/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
import {
  isParsableAsInt,
  isString,
} from "@battleship/common/utils/typeUtils.js";

// Assert that the needed environment variables are present and
// of the right types
if (
  !isString(process.env.GUEST_LIFETIME_SECONDS) ||
  !isParsableAsInt(process.env.GUEST_LIFETIME_SECONDS)
) {
  throw new Error(`Server configuration error: environment var 
  GUEST_LIFETIME_SECONDS missing or invalid`);
}

if (
  !isString(process.env.WS_AUTH_TICKET_LIFETIME_SECONDS) ||
  !isParsableAsInt(process.env.WS_AUTH_TICKET_LIFETIME_SECONDS)
) {
  throw new Error(`Server configuration error: environment var 
  WS_AUTH_TICKET_LIFETIME_SECONDS missing or invalid`);
}

if (!isString(process.env.PORT) || !isParsableAsInt(process.env.PORT)) {
  throw new Error(`Server configuration error: environment var 
  PORT missing or invalid`);
}

if (!isString(process.env.WS_PORT) || !isParsableAsInt(process.env.WS_PORT)) {
  throw new Error(`Server configuration error: environment var 
  WS_PORT missing or invalid`);
}

if (!isString(process.env.JWT_SECRET)) {
  throw new Error(`Server configuration error: environment var 
  JWT_SECRET missing or invalid`);
}

if (!isString(process.env.MONGODB_URI)) {
  throw new Error(`Server configuration error: environment var 
  MONGODB_URI missing or invalid`);
}

if (
  !isString(process.env.PWD_HASH_SALT_ROUNDS) ||
  !isParsableAsInt(process.env.PWD_HASH_SALT_ROUNDS)
) {
  throw new Error(`Server configuration error: environment var 
  PWD_HASH_SALT_ROUNDS missing or invalid`);
}

// After asserting the types of the env variables, save them as members
const GUEST_LIFETIME_SECONDS: number = Number.parseInt(
  process.env.GUEST_LIFETIME_SECONDS,
  10,
);
const WS_AUTH_TICKET_LIFETIME_SECONDS: number = Number.parseInt(
  process.env.WS_AUTH_TICKET_LIFETIME_SECONDS,
  10,
);
const JWT_SECRET: string = process.env.JWT_SECRET;
const PORT: number = Number.parseInt(process.env.PORT, 10);
const WS_PORT: number = Number.parseInt(process.env.WS_PORT, 10);
const MONGODB_URI = process.env.MONGODB_URI;
const PWD_HASH_SALT_ROUNDS = Number.parseInt(
  process.env.PWD_HASH_SALT_ROUNDS,
  10,
);

export default {
  GUEST_LIFETIME_SECONDS,
  WS_AUTH_TICKET_LIFETIME_SECONDS,
  JWT_SECRET,
  PORT,
  WS_PORT,
  MONGODB_URI,
  PWD_HASH_SALT_ROUNDS,
};
