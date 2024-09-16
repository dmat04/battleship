import { afterAll, beforeAll, afterEach, describe, expect, it } from "vitest";
import { RouteObject } from "react-router-dom";
import { act, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { WS } from "vitest-websocket-mock";
import React from "react";
import { renderWithStoreProvider } from "../../../test/utils.js";
import { RootState } from "../../store/store.js";
import {
  noUser,
  userAuthenticated,
} from "../../../test/reduxStateData/authSliceTestdata.js";
import { initialState } from "../../store/gameRoomSlice/stateTypes.js";
import { gameRoomCreated } from "../../../test/reduxStateData/gameRoomSliceTestdata.js";
import { createRoomHandler } from "../../../test/gqlRequestMocks/createRoomHandler.js";
import { getGameSettingsHandler } from "../../../test/gqlRequestMocks/getGameSettingsHandler.js";
import GameRoomMenu from "./index.js";
import { beforeEach } from "node:test";

const routerRoutes: RouteObject[] = [
  {
    path: "/",
    element: <GameRoomMenu />,
  },
  {
    path: "/login",
    element: "login",
  },
  {
    path: "/game/getReady",
    element: "getReady",
  },
];

const apiServer = setupServer(createRoomHandler, getGameSettingsHandler);

let dummyWSServer: WS | undefined;

describe("The GameRoomMenu component", () => {
  beforeAll(() =>
    apiServer.listen({
      onUnhandledRequest: "error",
    }),
  );

  beforeEach(() => {
    dummyWSServer = new WS(`${process.env.WS_URL}/game/gameID/userID`, {
      jsonProtocol: true,
    });
    void dummyWSServer.connected;
  });
  afterEach(() => {
    apiServer.resetHandlers();
    dummyWSServer?.close();
    WS.clean();
  });
  afterAll(() => apiServer.close());

  it("redirects to a login screen when no user is authenticated", () => {
    const preloadedState: Partial<RootState> = {
      auth: noUser,
      gameRoom: initialState,
    };

    renderWithStoreProvider(<></>, {
      preloadedState,
      routerRoutes,
    });

    const loginScreen = screen.getByText("login");
    expect(loginScreen).not.toBeNull();
  });

  it("redirects to a setup screen when a game room is already joined", () => {
    const preloadedState: Partial<RootState> = {
      auth: userAuthenticated,
      gameRoom: gameRoomCreated,
    };

    renderWithStoreProvider(<></>, {
      preloadedState,
      routerRoutes,
    });

    const setupScreen = screen.getByText("getReady");
    expect(setupScreen).not.toBeNull();
  });

  it("renders the start game and join game menu items when no game room is joined yet", () => {
    const preloadedState: Partial<RootState> = {
      auth: userAuthenticated,
      gameRoom: initialState,
    };

    renderWithStoreProvider(<GameRoomMenu />, { preloadedState });

    const container = screen.queryByTestId("container-game-room-menu");
    const startGameButton = screen.queryByTestId("button-start-game");
    const joinGameButton = screen.queryByTestId("button-join-game");

    expect(container).not.toBeNull();
    expect(startGameButton).not.toBeNull();
    expect(joinGameButton).not.toBeNull();
  });

  it("redirects to the getReady screen after selecting the start new game menu item", async () => {
    const preloadedState: Partial<RootState> = {
      auth: userAuthenticated,
      gameRoom: initialState,
    };

    renderWithStoreProvider(<></>, {
      preloadedState,
      routerRoutes,
    });

    const container = screen.getByTestId("container-game-room-menu");
    const startGameButton = screen.getByTestId("button-start-game");

    await act(() => fireEvent.click(startGameButton));

    expect(await screen.findByText("getReady")).toBeInTheDocument();
    expect(container).not.toBeInTheDocument();
  });
});
