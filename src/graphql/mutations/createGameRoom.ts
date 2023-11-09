import GameService from '../../services/GameService';

export const typeDefs = `#graphql
  extend type Mutation {
    createGameRoom: ID
  }
`;

export const resolvers = {
  Mutation: {
    createGameRoom: () => GameService.createNewGame(),
  },
};

export default {
  typeDefs,
  resolvers,
};
