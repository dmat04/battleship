import { gql } from "@apollo/client";

export const CHECK_USERNAME = gql(`
  query checkUsername($username: String!) {
    checkUsername(username: $username) {
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
