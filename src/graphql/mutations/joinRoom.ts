import AuthService from '../../services/AuthService';
import GameService from '../../services/GameRoomService';
import { assertAuthorized, type ApolloContext } from '../../middleware/ApolloContext';
import { RoomJoinedResult } from '../types/RoomJoinedResult';

interface MutationParams {
  inviteCode: string;
}

export const typeDefs = `#graphql
  extend type Mutation {
    joinRoom(inviteCode: String!): RoomJoinedResult!
  }
`;

export const resolvers = {
  Mutation: {
    joinRoom: async (
      _: any,
      args: MutationParams,
      context: ApolloContext,
    ): Promise<RoomJoinedResult> => {
      const accessToken = assertAuthorized(context);

      const user = await AuthService.getUserFromToken(accessToken);
      return GameService.joinWithInviteCode(args.inviteCode, user);
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
