export interface LoginResult {
  username: string,
  accessToken: string,
  expiresAt: number
}

export const typeDefs = `#graphql
  type LoginResult {
    username: String!
    accessToken: String!
    expiresAt: Int!
  }
`;

export default {
  typeDefs,
};
