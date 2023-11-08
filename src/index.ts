import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import { typeDefs, resolvers } from './graphql/schema';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const start = async () => {
  await apolloServer.start();

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer),
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log('Server is now running on PORT 4000');
  });
};

start();
