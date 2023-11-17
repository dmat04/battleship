import { GraphQLError } from 'graphql';
import type { ExpressContextFunctionArgument } from '@apollo/server/express4';

export interface ApolloContext {
  authToken: string | null
}

export const assertAuthorized = (context: ApolloContext): string => {
  const token = context.authToken;

  if (!token) {
    throw new GraphQLError('Acess token missing in request header', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  return token;
};

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
