export const typeDefs = `#graphql
  extend type Query {
    ping: String
  }
`;

export const resolvers = {
  Query: {
    ping: () => {
      console.log('Someone pinged here...');
      return 'Pong';
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
