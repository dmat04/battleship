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
