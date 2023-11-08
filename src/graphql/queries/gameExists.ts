import GameRegistry from '../../game/GameRegistry';

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
    gameExists: (_: any, args: QueryParams) => GameRegistry.gameExists(args.id),
  },
};

export default {
  typeDefs,
  resolvers,
};
