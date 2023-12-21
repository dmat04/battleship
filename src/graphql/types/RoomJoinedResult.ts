export interface RoomJoinedResult {
  readonly roomID: string;
  readonly wsAuthCode: string;
}

export const typeDefs = `#graphql
  type RoomJoinedResult {
    roomID: ID!
    wsAuthCode: String!
  }
`;

export default {
  typeDefs,
};
