import { merge } from 'lodash';

import Ping from './queries/ping';
import CreateGameRoom from './mutations/createGameRoom';
import GameExists from './queries/gameExists';
import LoginResultDefs from './types/LoginResult';
import GuestLoginResultDefs from './types/GuestLoginResult';
import guestLogin from './mutations/guestLogin';
import registerUser from './mutations/registerUser';
import registeredLogin from './mutations/registeredLogin';

const rootTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  rootTypeDefs,
  Ping.typeDefs,
  CreateGameRoom.typeDefs,
  GameExists.typeDefs,
  LoginResultDefs.typeDefs,
  GuestLoginResultDefs.typeDefs,
  guestLogin.typeDefs,
  registerUser.typeDefs,
  registeredLogin.typeDefs,
];

export const resolvers = merge(
  Ping.resolvers,
  CreateGameRoom.resolvers,
  GameExists.resolvers,
  guestLogin.resolvers,
  registerUser.resolvers,
  registeredLogin.resolvers,
);
