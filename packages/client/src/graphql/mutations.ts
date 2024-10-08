import { gql } from "@apollo/client";

export const GUEST_LOGIN = gql(`
  mutation guestLogin($username: String) {
    guestLogin(username: $username) {
      accessToken
      expiresAt
      username
      userID
    }
  }
`);

export const GITHUB_LOGIN = gql(`
  mutation githubLogin($accessCode: String!) {
    githubLogin(accessCode: $accessCode) {
      accessToken
      expiresAt
      username
      userID
    }
  }
`);

export const REGISTERED_LOGIN = gql(`
  mutation registeredLogin($username: String!, $password: String!) {
    registeredLogin(username: $username, password: $password) {
      accessToken
      expiresAt
      username
      userID
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

export const PLACE_SHIPS = gql(`
  mutation placeShips($roomId: ID!, $shipPlacements: [ShipPlacementInput!]!) {
    placeShips(roomID: $roomId, shipPlacements: $shipPlacements) {
      gameRoomStatus {
        player {
          id
          username
        }
        playerShipsPlaced
        playerSocketConnected
        opponent {
          id
          username
        }
        opponentShipsPlaced
        opponentSocketConnected
        currentPlayerID
      }
      placedShips {
        orientation
        ship {
          shipID
          size
          type
        }
        position {
          x
          y
        }
      }
    }
  }
`);
