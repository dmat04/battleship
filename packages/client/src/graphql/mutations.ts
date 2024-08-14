import { gql } from "@apollo/client";

export const GUEST_LOGIN = gql(`
  mutation guestLogin($username: String) {
    guestLogin(username: $username) {
      accessToken
      expiresAt
      username
    }
  }
`);

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

export const PLACE_SHIPS = gql(`
  mutation placeShips($roomId: ID!, $shipPlacements: [ShipPlacementInput!]!) {
    placeShips(roomID: $roomId, shipPlacements: $shipPlacements) {
      gameRoomStatus {
        currentPlayer
        opponent
        opponentShipsPlaced
        opponentSocketConnected
        player
        playerShipsPlaced
        playerSocketConnected
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
