/* eslint-disable no-console */
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import uWS from "uWebSockets.js";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import config from "./utils/config.js";
import createApolloServer from "./middleware/ApolloMiddleware.js";
import WSBehaviour from "./ws/GameServiceWSBehaviour.js";
import { contextFn } from "./middleware/ApolloAuthMiddleware.js";

const app = express();
const httpServer = http.createServer(app);
const apolloServer = createApolloServer(httpServer);

uWS
  .App()
  .ws("/game/:gameId/:username", WSBehaviour)
  .listen(config.WS_PORT, (token) => {
    if (token) {
      console.log(`WS server listening on port ${config.WS_PORT}`);
    } else {
      throw new Error("Couldn't start WS server");
    }
  });

const start = async () => {
  const mongoUrl =
    "mongodb://" +
    encodeURIComponent(config.DB_USER_USERNAME) +
    ":" +
    encodeURIComponent(config.DB_USER_PASSWORD) +
    "@" +
    encodeURIComponent(config.MONGODB_SERVER) +
    "/" + 
    encodeURIComponent(config.DB_DATABASE_NAME);

  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }

  await apolloServer.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, { context: contextFn }),
  );

  httpServer.listen({ port: config.PORT }, () => {
    console.log("Server is now running on PORT 4000");
  });
};

void start();
