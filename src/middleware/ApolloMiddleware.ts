import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import type { ExpressContextFunctionArgument } from '@apollo/server/express4';

import { typeDefs, resolvers } from '../graphql/schema';

export interface ApolloContext {
  authToken: string | null
}

export const contextFn = async (args: ExpressContextFunctionArgument): Promise<ApolloContext> => {
  const { authorization } = args.req.headers;
  if (authorization && authorization.startsWith('Bearer ')) {
    return {
      authToken: authorization.replace('Bearer ', ''),
    };
  }

  return {
    authToken: null,
  };
};

const createApolloServer = (httpServer: http.Server) => new ApolloServer<ApolloContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

export default createApolloServer;
