export interface GameCreatedResult {
  readonly gameId: string;
  readonly inviteCode: string;
  readonly wsAuthCode: string;
}

export const typeDefs = `#graphql
  type GameCreatedResult {
    gameId: ID!
    inviteCode: String!
    wsAuthCode: String!
  }
`;

export default {
  typeDefs,
};
