export interface UsernameQueryResult {
  readonly username: string;
  readonly taken: boolean;
  readonly validationError: string | undefined;
}

export const typeDefs = `#graphql
  type UsernameQueryResult {
    username: String!
    taken: Boolean!
    validationError: String
  }
`;

export default {
  typeDefs,
};
