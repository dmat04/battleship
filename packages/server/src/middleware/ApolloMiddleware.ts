import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";

import ApolloErrorFormatter from "./ApolloErrorFormatter.js";
import type { ApolloContext } from "@battleship/common/utils/ApolloContext.js";
import { typeDefs } from "../graphql/__generated__/typeDefs.generated.js";
import { resolvers } from "../graphql/__generated__/resolvers.generated.js";

const createApolloServer = (httpServer: http.Server): ApolloServer<ApolloContext> => {
  const server = new ApolloServer<ApolloContext>({
    typeDefs: typeDefs,
    resolvers: resolvers,
    formatError: ApolloErrorFormatter,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  return server;
}

export default createApolloServer;
