import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import {
  OPPONENT_NAME,
  gameRoomCreated,
  gameRoomJoined,
} from "../../../../test/reduxStateData/gameRoomSliceTestdata.js";
import { RootState } from "../../../store/store.js";
import { renderWithStoreProvider } from "../../../../test/utils.js";
import StatusHeader from "./index.js";
import { PlayerStatus } from "../../../store/gameRoomSlice/stateTypes.js";

describe("The StatusHeader component", () => {
  describe("displays the invite code when the user has created the game room", () => {
    it.each([
      {
        opponentStatus: PlayerStatus.Disconnected,
        opponentName: undefined,
        message: "waiting for an opponent to connect",
      },
      {
        opponentStatus: PlayerStatus.Connected,
        opponentName: OPPONENT_NAME,
        message: `${OPPONENT_NAME} connected, waiting`,
      },
      {
        opponentStatus: PlayerStatus.Ready,
        opponentName: OPPONENT_NAME,
        message: `${OPPONENT_NAME} ready`,
      },
    ])(
      "and the correct opponent status message when the opponent status is $opponentStatus",
      ({ opponentStatus, opponentName, message }) => {
        const preloadedState: Partial<RootState> = {
          gameRoom: {
            ...gameRoomCreated,
            opponentStatus,
            opponentName,
          },
        };

        renderWithStoreProvider(<StatusHeader />, { preloadedState });

        const inviteCodeContainer = screen.getByTestId("container-invite-code");
        const opponentStatusContainer = screen.getByTestId(
          "container-opponent-status",
        );

        expect(inviteCodeContainer).toBeVisible();
        expect(inviteCodeContainer.textContent).toMatch(
          gameRoomCreated.inviteCode,
        );
        expect(opponentStatusContainer).toBeVisible();
        expect(opponentStatusContainer.textContent).toMatch(
          new RegExp(message, "i"),
        );
      },
    );
  });

  describe("displays no invite code when a user joins an existing room", () => {
    it.each([
      {
        opponentStatus: PlayerStatus.Disconnected,
        opponentName: undefined,
        message: "waiting for an opponent to connect",
      },
      {
        opponentStatus: PlayerStatus.Connected,
        opponentName: OPPONENT_NAME,
        message: `${OPPONENT_NAME} connected, waiting`,
      },
      {
        opponentStatus: PlayerStatus.Ready,
        opponentName: OPPONENT_NAME,
        message: `${OPPONENT_NAME} ready`,
      },
    ])(
      "and the correct opponent status message when the opponent status is $opponentStatus",
      ({ opponentStatus, opponentName, message }) => {
        const preloadedState: Partial<RootState> = {
          gameRoom: {
            ...gameRoomJoined,
            opponentStatus,
            opponentName,
          },
        };

        renderWithStoreProvider(<StatusHeader />, { preloadedState });

        const inviteCodeContainer = screen.queryByTestId("container-invite-code");
        const opponentStatusContainer = screen.getByTestId(
          "container-opponent-status",
        );

        expect(inviteCodeContainer).toBeFalsy();
        expect(opponentStatusContainer).toBeVisible();
        expect(opponentStatusContainer.textContent).toMatch(
          new RegExp(message, "i"),
        );
      },
    );
  });
});
