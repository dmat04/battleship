import { merge } from 'lodash';

import LoginResultDefs from './types/LoginResult';
import RoomCreatedResultDefs from './types/RoomCreatedResult';
import RoomJoinedResultDefs from './types/RoomJoinedResult';
import GameSettingsTypes from './types/GameTypes';
import Ping from './queries/ping';
import CreateRoom from './mutations/createRoom';
import JoinRoom from './mutations/joinRoom';
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
  RoomCreatedResultDefs.typeDefs,
  RoomJoinedResultDefs.typeDefs,
  GameSettingsTypes.typeDefs,
  Ping.typeDefs,
  CreateRoom.typeDefs,
  JoinRoom.typeDefs,
  PlaceShips.typeDefs,
  gameSettings.typeDefs,
  guestLogin.typeDefs,
  registerUser.typeDefs,
  registeredLogin.typeDefs,
];

export const resolvers = merge(
  GameSettingsTypes.resolvers,
  Ping.resolvers,
  CreateRoom.resolvers,
  JoinRoom.resolvers,
  PlaceShips.resolvers,
  gameSettings.resolvers,
  guestLogin.resolvers,
  registerUser.resolvers,
  registeredLogin.resolvers,
);
