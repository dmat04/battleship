import GameService from '../../services/GameService';

export interface QueryParams {
  id: string,
}

export const typeDefs = `#graphql
  extend type Query {
    gameExists(id: ID!): Boolean
  }
`;

export const resolvers = {
  Query: {
    gameExists: (_: any, args: QueryParams) => GameService.gameExists(args.id),
  },
};

export default {
  typeDefs,
  resolvers,
};
