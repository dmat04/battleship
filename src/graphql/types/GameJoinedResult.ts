export interface GameJoinedResult {
  readonly gameId: string;
  readonly wsAuthCode: string;
}

export const typeDefs = `#graphql
  type GameJoinedResult {
    gameId: ID!
    wsAuthCode: String!
  }
`;

export default {
  typeDefs,
};
