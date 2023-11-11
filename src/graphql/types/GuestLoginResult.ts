export interface GuestLoginResult {
  accessToken: string,
  username: string,
  expiresAt: string
}

export const typeDefs = `#graphql
  type GuestLoginResult {
    accessToken: String!
    username: String!
    expiresAt: String!
  }
`;

export default {
  typeDefs,
};
