import { gql } from "@apollo/client";

export const CHECK_GUEST_USERNAME = gql(`
  query checkGuestUsername($username: String!) {
    checkGuestUsername(username: $username) {
      taken
      username
      validationError
    }
  }
`);

export const CHECK_REGISTERED_USERNAME = gql(`
  query checkRegisteredUsername($username: String!) {
    checkRegisteredUsername(username: $username) {
      taken
      username
      validationError
    }
  }
`);

export const GET_GAME_SETTINGS = gql(`
  query gameSettings($gameId: ID!) {
    gameSettings(gameId: $gameId) {
      boardHeight
      boardWidth
      turnDuration
      availableShips {
        shipID
        size
        type
      }
    }
}
`);
