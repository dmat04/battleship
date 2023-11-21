import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import uWS from 'uWebSockets.js';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';

import config from './utils/config';
import createApolloServer from './middleware/ApolloMiddleware';
import { contextFn } from './middleware/ApolloContext';
import WSBehaviour from './services/GameServiceWSBehaviour';

const app = express();
const httpServer = http.createServer(app);
const apolloServer = createApolloServer(httpServer);

uWS.App()
  .ws('/game/:gameId/:username', WSBehaviour)
  .listen(config.WS_PORT, (token) => {
    if (token) {
      console.log(`WS server listening on port ${config.WS_PORT}`);
    } else {
      throw new Error('Couldn\'t start WS server');
    }
  });

const start = async () => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch {
    console.log('Error connecting to MongoDB');
  }

  await apolloServer.start();

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, { context: contextFn }),
  );

  httpServer.listen({ port: config.PORT }, () => {
    console.log('Server is now running on PORT 4000');
  });
};

start();
