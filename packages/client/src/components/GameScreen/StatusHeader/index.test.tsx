import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WS } from "vitest-websocket-mock";
import React from "react";
import {
  OPPONENT_NAME,
  gameRoomCreated,
  gameRoomJoined,
  gameSettings,
} from "../../../../test/reduxStateData/gameRoomSliceTestdata.js";
import { RootState } from "../../../store/store.js";
import { renderWithStoreProvider } from "../../../../test/utils.js";
import StatusHeader from "./index.js";
import { PlayerStatus } from "../../../store/gameRoomSlice/stateTypes.js";
import {
  GameStartedMessage,
  RoomStatusResponseMessage,
  ServerMessageCode,
} from "@battleship/common/messages/MessageTypes.js";
import { PLAYER_NAME } from "../../../../test/reduxStateData/authSliceTestdata.js";

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

        const inviteCodeContainer = screen.queryByTestId(
          "container-invite-code",
        );
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

  it("updates the displayed content whenever the room status updates", async () => {
    const wsServer = new WS(
      `${process.env.WS_URL}/game/${gameRoomCreated.roomID}/${PLAYER_NAME}`,
      { jsonProtocol: true },
    );

    const preloadedState: Partial<RootState> = {
      gameRoom: {
        ...gameRoomCreated,
        playerName: PLAYER_NAME,
        playerStatus: PlayerStatus.Connected,
        gameSettings,
      },
    };

    renderWithStoreProvider(<StatusHeader />, { preloadedState });
    await wsServer?.connected;

    const inviteCodeContainer = screen.getByTestId("container-invite-code");
    const opponentStatusContainer = screen.getByTestId(
      "container-opponent-status",
    );

    expect(inviteCodeContainer).toBeVisible();
    expect(inviteCodeContainer.textContent).toMatch(gameRoomCreated.inviteCode);
    expect(opponentStatusContainer).toBeVisible();
    expect(opponentStatusContainer.textContent).toMatch(
      new RegExp("waiting for an opponent to connect", "i"),
    );

    const opponentJoinedMessage: RoomStatusResponseMessage = {
      code: ServerMessageCode.RoomStatusResponse,
      roomStatus: {
        currentPlayer: PLAYER_NAME,
        opponent: OPPONENT_NAME,
        opponentShipsPlaced: false,
        opponentSocketConnected: false,
        player: PLAYER_NAME,
        playerShipsPlaced: false,
        playerSocketConnected: true,
      },
    };
    act(() => wsServer?.send(opponentJoinedMessage));

    await waitFor(() => expect(inviteCodeContainer).not.toBeVisible());
    expect(opponentStatusContainer).toBeVisible();
    expect(opponentStatusContainer.textContent).toMatch(
      new RegExp(`${OPPONENT_NAME} connected, waiting`, "i"),
    );

    const opponentReadyMessage: RoomStatusResponseMessage = {
      code: ServerMessageCode.RoomStatusResponse,
      roomStatus: {
        currentPlayer: PLAYER_NAME,
        opponent: OPPONENT_NAME,
        opponentShipsPlaced: true,
        opponentSocketConnected: true,
        player: PLAYER_NAME,
        playerShipsPlaced: false,
        playerSocketConnected: true,
      },
    };
    act(() => wsServer?.send(opponentReadyMessage));

    expect(inviteCodeContainer).not.toBeVisible();
    expect(opponentStatusContainer).toBeVisible();
    expect(opponentStatusContainer.textContent).toMatch(
      new RegExp(`${OPPONENT_NAME} ready`, "i"),
    );

    const gameStartedMessage: GameStartedMessage = {
      code: ServerMessageCode.GameStarted,
      playsFirst: PLAYER_NAME,
    };
    act(() => wsServer?.send(gameStartedMessage));

    expect(inviteCodeContainer).not.toBeVisible();
    await waitFor(() => expect(opponentStatusContainer).not.toBeVisible());

    WS.clean();
  });
});
