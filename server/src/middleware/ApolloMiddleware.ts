import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";

import ApolloErrorFormatter from "./ApolloErrorFormatter";
import type { ApolloContext } from "@battleship/common/utils/ApolloContext";
import { typeDefs } from "../graphql/__generated__/typeDefs.generated";
import { resolvers } from "../graphql/__generated__/resolvers.generated";

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
