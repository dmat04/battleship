import { gql } from '../__generated__/gql';

export const REGISTERED_LOGIN = gql(`
  mutation registeredLogin($username: String!, $password: String!) {
    registeredLogin(username: $username, password: $password) {
      accessToken
      expiresAt
      username
    }
  }
`);

export const CREATE_ROOM = gql(`
  mutation createRoom {
    createRoom {
      roomID
      inviteCode
      wsAuthCode
    }
  }
`);

export const JOIN_ROOM = gql(`
  mutation joinRoom($inviteCode: String!) {
    joinRoom(inviteCode: $inviteCode) {
      roomID
      wsAuthCode
    }
  }
`);

export const GET_GAME_SETTINGS = gql(`
  query GameSettings($gameId: ID!) {
    gameSettings(gameId: $gameId) {
      boardHeight
      boardWidth
      shipClasses {
        size
        type
      }
      shipCounts {
        class
        count
      }
    }
}
`);
