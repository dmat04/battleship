import GameRegistry from '../../game/GameRegistry';

export const typeDefs = `#graphql
  extend type Mutation {
    createGameRoom: ID
  }
`;

export const resolvers = {
  Mutation: {
    createGameRoom: () => GameRegistry.createNewGame(),
  },
};

export default {
  typeDefs,
  resolvers,
};
