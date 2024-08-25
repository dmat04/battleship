import { CheckUsernameQuery, CheckUsernameQueryVariables } from "@battleship/common/types/__generated__/types.generated.js";
import { HttpResponse, graphql } from "msw";
import { PLAYER_NAME } from "../reduxStateData/authSliceTestdata";
import { OPPONENT_NAME } from "../reduxStateData/gameRoomSliceTestdata";

const EXISTING_USERNAMES = [ PLAYER_NAME, OPPONENT_NAME ];

export const checkUsernameHandler = graphql.query<CheckUsernameQuery, CheckUsernameQueryVariables>(
  'checkUsername',
  ({ variables }) => {
    if (EXISTING_USERNAMES.find((it) => it === variables.username)) {
      return HttpResponse.json({
        data: {
          checkUsername: {
            taken: true,
            username: variables.username,
            validationError: "Username taken"
          }
        }
      });
    } else {
      return HttpResponse.json({
        data: {
          checkUsername: {
            taken: false,
            username: variables.username,
            validationError: null,
          }
        }
      });
    }
})