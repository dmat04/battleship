export interface LoginResult {
  accessToken: string,
  username: string,
  expiresAt: string
}

export const typeDefs = `#graphql
  type LoginResult {
    accessToken: String!
    username: String!
    expiresAt: String!
  }
`;

export default {
  typeDefs,
};
