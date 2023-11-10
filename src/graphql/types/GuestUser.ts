export interface GuestUser {
  accessToken: string,
  username: string,
  expiresAt: string
}

export const typeDefs = `#graphql
  type GuestUser {
    accessToken: String!
    username: String!
    expiresAt: String!
  }
`;

export default {
  typeDefs,
};
