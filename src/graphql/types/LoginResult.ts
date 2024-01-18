export interface LoginResult {
  username: string,
  accessToken: string,
  expiresAt: string
}

export const typeDefs = `#graphql
  type LoginResult {
    username: String!
    accessToken: String!
    expiresAt: String!
  }
`;

export default {
  typeDefs,
};
