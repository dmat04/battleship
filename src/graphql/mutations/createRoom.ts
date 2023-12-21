import AuthService from '../../services/AuthService';
import GameService from '../../services/GameRoomService';
import type { RoomCreatedResult } from '../types/RoomCreatedResult';
import { ApolloContext, assertAuthorized } from '../../middleware/ApolloContext';

export const typeDefs = `#graphql
  extend type Mutation {
    createRoom: RoomCreatedResult!
  }
`;

export const resolvers = {
  Mutation: {
    createRoom: async (_: any, __: any, context: ApolloContext): Promise<RoomCreatedResult> => {
      const accessToken = assertAuthorized(context);

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.createNewRoom(user);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
