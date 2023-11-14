import { merge } from 'lodash';

import LoginResultDefs from './types/LoginResult';
import GameCreatedResultDefs from './types/GameCreatedResult';
import GameSettingsTypes from './types/GameTypes';
import Ping from './queries/ping';
import CreateGame from './mutations/createGame';
import JoinGame from './mutations/joinGame';
import PlaceShips from './mutations/placeShips';
import gameSettings from './queries/gameSettings';
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
  GameSettingsTypes.typeDefs,
  Ping.typeDefs,
  CreateGame.typeDefs,
  JoinGame.typeDefs,
  PlaceShips.typeDefs,
  gameSettings.typeDefs,
  guestLogin.typeDefs,
  registerUser.typeDefs,
  registeredLogin.typeDefs,
];

export const resolvers = merge(
  GameSettingsTypes.resolvers,
  Ping.resolvers,
  CreateGame.resolvers,
  JoinGame.resolvers,
  PlaceShips.resolvers,
  gameSettings.resolvers,
  guestLogin.resolvers,
  registerUser.resolvers,
  registeredLogin.resolvers,
);
