import { gql } from '../__generated__/gql';

export const CHECK_USERNAME = gql(`
  query checkUsername($username: String!) {
    checkUsername(username: $username) {
      taken
      username
      validationError
    }
  }
`);

export default {};
