import { merge } from 'lodash';

import Ping from './queries/ping';
import CreateGameRoom from './mutations/createGameRoom';
import GameExists from './queries/gameExists';
import LoginResultDefs from './types/LoginResult';
import guestLogin from './mutations/guestLogin';

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
  guestLogin.typeDefs,
];

export const resolvers = merge(
  Ping.resolvers,
  CreateGameRoom.resolvers,
  GameExists.resolvers,
  guestLogin.resolvers,
);
