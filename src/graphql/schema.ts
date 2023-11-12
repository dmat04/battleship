import { merge } from 'lodash';

import LoginResultDefs from './types/LoginResult';
import GameCreatedResultDefs from './types/GameCreatedResult';
import Ping from './queries/ping';
import CreateGame from './mutations/createGame';
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
  LoginResultDefs.typeDefs,
  GameCreatedResultDefs.typeDefs,
  Ping.typeDefs,
  CreateGame.typeDefs,
  guestLogin.typeDefs,
  registerUser.typeDefs,
  registeredLogin.typeDefs,
];

export const resolvers = merge(
  Ping.resolvers,
  CreateGame.resolvers,
  guestLogin.resolvers,
  registerUser.resolvers,
  registeredLogin.resolvers,
);
