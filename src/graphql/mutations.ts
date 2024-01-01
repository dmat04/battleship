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

export const CREATE_ROOM = gql`
mutation createRoom {
  createRoom {
    roomID
    inviteCode
    wsAuthCode
  }
}
`;

export const JOIN_ROOM = gql`
mutation joinRoom($inviteCode: String!) {
  joinRoom(inviteCode: $inviteCode) {
    roomID
    wsAuthCode
  }
}
`;
