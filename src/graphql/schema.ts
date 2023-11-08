import { merge } from 'lodash';

import Ping from './queries/ping';

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
  Ping.typeDefs,
];

export const resolvers = merge(
  Ping.resolvers,
);
