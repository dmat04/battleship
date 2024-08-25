import { CreateRoomMutation } from "@battleship/common/types/__generated__/types.generated.js";
import { HttpResponse, graphql } from "msw";
import {
  INVITE_CODE,
  ROOM_ID,
  WS_AUTH_CODE,
} from "../reduxStateData/gameRoomSliceTestdata.js";

export const createRoomHandler = graphql.mutation<CreateRoomMutation>(
  "createRoom",
  () => {
    return HttpResponse.json({
      data: {
        createRoom: {
          inviteCode: INVITE_CODE,
          roomID: ROOM_ID,
          wsAuthCode: WS_AUTH_CODE,
        },
      },
    });
  },
);
