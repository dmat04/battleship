import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';

import { typeDefs, resolvers } from '../graphql/schema';
import ApolloErrorFormatter from './ApolloErrorFormatter';
import { ApolloContext } from './ApolloContext';

const createApolloServer = (httpServer: http.Server) => new ApolloServer<ApolloContext>({
  typeDefs,
  resolvers,
  formatError: ApolloErrorFormatter,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

export default createApolloServer;
