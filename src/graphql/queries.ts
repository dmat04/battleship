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
