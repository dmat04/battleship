import { Player } from "@battleship/common/types/__generated__/types.generated.ts";
import { AuthSliceState } from "../../src/store/authSlice.js";

export const PLAYER: Player = {
  id: "PlayerNameUserID",
  username: "PlayerName",
};

export const noUser: AuthSliceState = {
  loginRequestPending: false,
  loginResult: null,
};

export const userAuthenticated: AuthSliceState = {
  loginRequestPending: false,
  loginResult: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikd1ZXN0IzIzNzAzIiwiaWF0IjoxNzI0NTEwMzQxLCJleHAiOjE3MjQ1OTY3NDF9.-uhSJqsNGmHLSMSWiGje8f-8o8pxZQF9PwV_B8_IVpw',
    expiresAt: `${Date.now() + 24 * 3600 * 1000}`,
    userID: PLAYER.id,
    username: PLAYER.username,
  },
};