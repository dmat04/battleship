import {
  GameSettingsQuery,
  GameSettingsQueryVariables,
} from "@battleship/common/types/__generated__/types.generated.js";
import { HttpResponse, graphql } from "msw";
import { gameSettings } from "../reduxStateData/gameRoomSliceTestdata.js";

export const getGameSettingsHandler = graphql.query<
  GameSettingsQuery,
  GameSettingsQueryVariables
>("gameSettings", () => {
  return HttpResponse.json({
    data: {
      gameSettings,
    },
  });
});
