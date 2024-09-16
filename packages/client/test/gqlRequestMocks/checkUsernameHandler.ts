import {
  CheckUsernameQuery,
  CheckUsernameQueryVariables,
} from "@battleship/common/types/__generated__/types.generated.ts";
import { HttpResponse, graphql } from "msw";
import { PLAYER } from "../reduxStateData/authSliceTestdata";
import { OPPONENT } from "../reduxStateData/gameRoomSliceTestdata";
import { Player } from "@battleship/common/types/__generated__/types.generated.js";

const EXISTING_USERS: Player[] = [PLAYER, OPPONENT] as const;

export const checkUsernameHandler = graphql.query<
  CheckUsernameQuery,
  CheckUsernameQueryVariables
>("checkUsername", ({ variables }) => {
  if (EXISTING_USERS.find((it) => it.username === variables.username)) {
    return HttpResponse.json({
      data: {
        checkUsername: {
          taken: true,
          username: variables.username,
          validationError: "Username taken",
        },
      },
    });
  } else {
    return HttpResponse.json({
      data: {
        checkUsername: {
          taken: false,
          username: variables.username,
          validationError: null,
        },
      },
    });
  }
});
