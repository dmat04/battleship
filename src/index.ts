import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';

import config from './utils/config';
import createApolloServer from './middleware/ApolloMiddleware';

const app = express();
const httpServer = http.createServer(app);
const apolloServer = createApolloServer(httpServer);

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
    expressMiddleware(apolloServer),
  );

  httpServer.listen({ port: config.PORT }, () => {
    console.log('Server is now running on PORT 4000');
  });
};

start();
