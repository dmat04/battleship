import AuthService from '../../services/AuthService';

interface QueryParams {
  username: string;
}

export const typeDefs = `#graphql
  extend type Query {
    checkUsername(username: String!): UsernameQueryResult!
  }
`;

export const resolvers = {
  Query: {
    checkUsername: (_: any, args: QueryParams) => AuthService.checkUsername(args.username),
  },
};

export default {
  typeDefs,
  resolvers,
};
