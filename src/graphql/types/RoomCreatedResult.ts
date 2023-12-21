export interface RoomCreatedResult {
  readonly roomID: string;
  readonly inviteCode: string;
  readonly wsAuthCode: string;
}

export const typeDefs = `#graphql
  type RoomCreatedResult {
    roomID: ID!
    inviteCode: String!
    wsAuthCode: String!
  }
`;

export default {
  typeDefs,
};
