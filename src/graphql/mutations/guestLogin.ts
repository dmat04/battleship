import jwt from 'jsonwebtoken';
import { add } from 'date-fns';
import { generateGuestUsername } from '../../utils/userUtils';

export interface MutationParams {
  username: string | undefined;
}

export interface MutationResult {
  accessToken: string,
  username: string,
  expiresAt: string
}

export const typeDefs = `#graphql
  extend type Mutation {
    guestLogin(username: String): GuestUser
  }
`;

export const resolvers = {
  Mutation: {
    guestLogin: (_: any, args: MutationParams): MutationResult => {
      // TODO: create auth service !!!
      const username = args.username ?? generateGuestUsername();
      const expiresAt = add(Date.now(), { hours: 24 });

      const token = jwt.sign(
        {
          username,
          expiresAt,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '24h',
        },
      );

      return {
        accessToken: token,
        username,
        expiresAt: expiresAt.toString(),
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
