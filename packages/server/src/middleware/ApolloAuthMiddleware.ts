import { GraphQLError } from "graphql";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { ApolloContext } from "@battleship/common/utils/ApolloContext.js";
import AuthService from "../services/AuthService.js";
import { User } from "@battleship/common/dbModels/Users/UserDbModel.js";

export const assertAuthorized = (context: ApolloContext): User => {
  const { user } = context;

  if (!user) {
    throw new GraphQLError("Acess token missing or expired", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return user;
};

export const contextFn = async ({
  req,
}: ExpressContextFunctionArgument): Promise<ApolloContext> => {
  const { authorization } = req.headers;
  if (!authorization) return { user: null };

  if (authorization.startsWith("Bearer ")) {
    try {
      const user = await AuthService.getUserFromToken(
        authorization.replace("Bearer ", ""),
      );
      return {
        user,
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
