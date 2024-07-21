/* eslint-disable object-curly-newline */
import styled, { useTheme } from "styled-components";
import { animated, useTransition } from "@react-spring/web";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { PlacedShip } from "../../../__generated__/graphql";
import { opponentCellClicked } from "../../../store/gameRoomSlice";
import { GameRoomIsReady } from "../../../store/gameRoomSlice/stateTypes";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { assertNever } from "../../../utils/typeUtils";
import GameGrid from "../../GameGrid";
import { Theme } from "../../assets/themes/themeDefault";
import { calculateGridPosition } from "./utils";
import Ship from "../Ship";
import { Coordinates } from "../../../store/shipPlacementSlice/types";

const Container = styled.div<{ $owner: Props["owner"]; $active: boolean }>`
  grid-area: ${(props) => props.$owner};
  opacity: ${(props) => (props.$active ? 1 : 0.5)};
  transition: opacity 0.5s;
`;

const Cell = styled(animated.div)<{ $col: number; $row: number; theme: Theme }>`
  grid-column: ${(props) => props.$col + 1} / span 1;
  grid-row: ${(props) => props.$row + 1} / span 1;
  z-index: 2;
`;

interface Props {
  owner: "player" | "opponent";
}

const LiveGameGrid = ({ owner }: Props) => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<HTMLDivElement>(null);
  const theme = useTheme() as Theme;
  const { colors } = theme;

  const { gameStarted, currentPlayer } = useAppSelector(
    (state) => state.gameRoom,
  );
  const ownerName = useAppSelector((state) => {
    switch (owner) {
      case "player":
        return state.gameRoom.playerName;
      case "opponent":
        return state.gameRoom.opponentName;
      default:
        return assertNever(owner);
    }
  });

  const settings = useAppSelector((state) => state.gameRoom.gameSettings);
  const gridState = useAppSelector((state) => {
    if (!GameRoomIsReady(state.gameRoom)) return null;

    switch (owner) {
      case "player":
        return state.gameRoom.playerScore;
      case "opponent":
        return state.gameRoom.opponentScore;
      default:
        return assertNever(owner);
    }
  });

  const playerShips = useAppSelector((state) => {
    if (owner !== "player" || !state.gameRoom.playerShips) return undefined;

    return state.gameRoom.playerShips;
  });

  const aliveShips = useMemo(
    () =>
      playerShips?.filter(
        (ship) =>
          gridState?.sunkenShips.find(
            (sunken) => sunken.ship.shipID === ship.ship.shipID,
          ) === undefined,
      ),
    [gridState?.sunkenShips, playerShips],
  );

  const gridClickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (ev) => {
      if (owner === "player") return;

      const coords = calculateGridPosition(ev, gridRef.current, settings);
      if (coords) dispatch(opponentCellClicked(coords));
    },
    [dispatch, settings, owner],
  );

  const [hitTransition, hitTransitionApi] = useTransition<Coordinates, any>(
    gridState?.hitCells ?? [],
    () => ({
      keys: (coord: Coordinates) => `${owner}-hit-${coord.x}-${coord.y}`,
      from: {
        opacity: 0.5,
        scale: 0.66,
        background: colors.hitCellHighlight,
        zIndex: 10,
      },
      enter: [
        {
          opacity: 1,
          scale: 1.2,
          background: colors.hitCellHighlight,
          zIndex: 10,
        },
        { scale: 1, background: colors.hitCell, zIndex: 1 },
      ],
    }),
  );

  const [missTransition, missTransitionApi] = useTransition<Coordinates, any>(
    gridState?.missedCells ?? [],
    () => ({
      keys: (coord: Coordinates) => `${owner}-miss-${coord.x}-${coord.y}`,
      from: {
        opacity: 0.5,
        scale: 0.66,
        background: colors.missedCell,
        zIndex: 10,
      },
      enter: [
        { opacity: 1, scale: 1.2, zIndex: 10 },
        { scale: 1, zIndex: 1 },
      ],
    }),
  );

  const [inaccessibleTransition, inaccessibleTransitionApi] = useTransition<
    Coordinates,
    any
  >(gridState?.inaccessibleCells ?? [], () => ({
    keys: (coord: Coordinates) => `${owner}-empty-${coord.x}-${coord.y}`,
    from: {
      opacity: 0,
      scale: 0.66,
      background: colors.missedCell,
      zIndex: 10,
    },
    enter: { opacity: 1, scale: 1, background: colors.missedCell, zIndex: 1 },
  }));

  const [shipTransition, shipTransitionApi] = useTransition<PlacedShip, any>(
    gridState?.sunkenShips ?? [],
    () => ({
      keys: (ship: PlacedShip) => `${owner}-ship-${ship.x}-${ship.y}`,
      from: {
        opacity: 1,
        scale: 1,
        background: "transparent",
        fill: colors.shipFill,
        stroke: colors.shipStroke,
        zIndex: 20,
      },
      enter: () => async (next: Function) => {
        await next({
          scale: 1.2,
          fill: colors.sunkShipHighlight,
          stroke: colors.sunkShipHighlight,
        });
        await next({
          scale: 1,
          fill: colors.sunkShipFill,
          stroke: colors.sunkShipStroke,
        });
        await next({
          zIndex: 1,
          background: colors.missedCell,
        });
        inaccessibleTransitionApi.start();
      },
    }),
  );

  useEffect(() => {
    hitTransitionApi.start();
  }, [gridState?.hitCells]);

  useEffect(() => {
    missTransitionApi.start();
  }, [gridState?.missedCells]);

  useEffect(() => {
    shipTransitionApi.start();
  }, [gridState?.sunkenShips]);

  useEffect(() => {
    hitTransitionApi.set({ background: colors.hitCell });
    missTransitionApi.set({ background: colors.missedCell });
    shipTransitionApi.set({
      fill: colors.sunkShipFill,
      stroke: colors.sunkShipStroke,
      background: colors.missedCell,
    });
    inaccessibleTransitionApi.set({ background: colors.missedCell });
  }, [
    theme,
    colors.hitCell,
    colors.missedCell,
    colors.sunkShipFill,
    colors.sunkShipStroke,
  ]);

  const { boardWidth, boardHeight } = settings ?? {
    boardWidth: 10,
    boardHeight: 10,
  };

  const active = gameStarted && currentPlayer !== ownerName;

  return (
    <Container $owner={owner} $active={active}>
      <GameGrid
        ref={gridRef}
        onClick={gridClickHandler}
        rows={boardHeight}
        columns={boardWidth}
      >
        {shipTransition(({ fill, stroke, ...style }, item) => (
          <Ship
            ref={() => {}}
            col={item.x}
            row={item.y}
            size={item.ship.size}
            orientation={item.orientation}
            containerStyle={{ ...style }}
            imageStyle={{ fill, stroke }}
          />
        ))}
        {hitTransition((style, item) => (
          <Cell style={style} $col={item.x} $row={item.y} />
        ))}
        {missTransition((style, item) => (
          <Cell style={style} $col={item.x} $row={item.y} />
        ))}
        {inaccessibleTransition((style, item) => (
          <Cell style={style} $col={item.x} $row={item.y} />
        ))}
        {aliveShips?.map((ship) => (
          <Ship
            ref={() => {}}
            key={ship.ship.shipID}
            col={ship.x}
            row={ship.y}
            size={ship.ship.size}
            orientation={ship.orientation}
          />
        ))}
      </GameGrid>
    </Container>
  );
};

export default LiveGameGrid;
