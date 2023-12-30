import { gql } from '@apollo/client';

export const REGISTERED_LOGIN = gql`
  mutation registeredLogin($username: String!, $password: String!) {
    registeredLogin(username: $username, password: $password) {
      accessToken
      expiresAt
      username
    }
}
`;
