export interface LoginResult {
  accessToken: string,
  expiresAt: string
}

export const typeDefs = `#graphql
  type LoginResult {
    accessToken: String!
    expiresAt: String!
  }
`;

export default {
  typeDefs,
};
