export interface GameCreatedResult {
  readonly gameId: string;
  readonly inviteCode: string;
}

export const typeDefs = `#graphql
  type GameCreatedResult {
    gameId: ID!
    inviteCode: String!
  }
`;

export default {
  typeDefs,
};
