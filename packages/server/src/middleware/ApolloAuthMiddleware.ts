import { GraphQLError } from "graphql";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { ApolloContext } from "@battleship/common/utils/ApolloContext.js";
import SessionService from "../services/SessionService.js";
import { UnpopulatedSession } from "@battleship/common/entities/SessionDbModel.js";

export const assertAuthorized = (context: ApolloContext): UnpopulatedSession => {
  const { session } = context;

  if (!session) {
    throw new GraphQLError("Acess token missing or expired", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return session;
};

export const contextFn = async ({
  req,
}: ExpressContextFunctionArgument): Promise<ApolloContext> => {
  const { authorization } = req.headers;
  if (!authorization) return { session: null };

  if (authorization.startsWith("Bearer ")) {
    try {
      const session = await SessionService.getSessionFromToken(
        authorization.replace("Bearer ", ""),
      );
      return {
        session,
      };
    } catch {
      throw new GraphQLError("Acess token missing or expired", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
  } else {
    throw new GraphQLError("Wrong authorization scheme", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};
