/* eslint-disable object-curly-newline */
import { styled, useTheme } from "styled-components";
import { animated, useTransition } from "@react-spring/web";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  PlacedShip,
  Coordinate,
} from "@battleship/common/types/__generated__/types.generated.js";
import { opponentCellClicked } from "../../../store/gameRoomSlice/index.js";
import { GameRoomIsReady } from "../../../store/gameRoomSlice/stateTypes.js";
import { useAppDispatch, useAppSelector } from "../../../store/store.js";
import { assertNever } from "@battleship/common/utils/typeUtils.js";
import GameGrid from "../../GameGrid/index.js";
import { Theme } from "../../assets/themes/themeDefault.js";
import { calculateGridPosition } from "./utils.js";
import Ship from "../Ship/index.js";

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

interface CellTransitionProps {
  opacity?: number;
  scale?: number;
  background?: string;
  zIndex?: number;
}

interface ShipTransitionProps {
  opacity?: number;
  scale?: number;
  background?: string;
  fill?: string;
  stroke?: string;
  zIndex?: number;
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
      if (coords) void dispatch(opponentCellClicked(coords));
    },
    [dispatch, settings, owner],
  );

  const [hitTransition, hitTransitionApi] = useTransition<
    Coordinate,
    CellTransitionProps
  >(gridState?.hitCells ?? [], () => ({
    keys: (coord: Coordinate) => `${owner}-hit-${coord.x}-${coord.y}`,
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
  }));

  const [missTransition, missTransitionApi] = useTransition<
    Coordinate,
    CellTransitionProps
  >(gridState?.missedCells ?? [], () => ({
    keys: (coord: Coordinate) => `${owner}-miss-${coord.x}-${coord.y}`,
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
  }));

  const [inaccessibleTransition, inaccessibleTransitionApi] = useTransition<
    Coordinate,
    CellTransitionProps
  >(gridState?.inaccessibleCells ?? [], () => ({
    keys: (coord: Coordinate) => `${owner}-empty-${coord.x}-${coord.y}`,
    from: {
      opacity: 0,
      scale: 0.66,
      background: colors.missedCell,
      zIndex: 10,
    },
    enter: { opacity: 1, scale: 1, background: colors.missedCell, zIndex: 1 },
  }));

  const [shipTransition, shipTransitionApi] = useTransition<
    PlacedShip,
    ShipTransitionProps
  >(gridState?.sunkenShips ?? [], () => ({
    keys: (ship: PlacedShip) => `${owner}-ship-${ship.position.x}-${ship.position.y}`,
    from: {
      opacity: 1,
      scale: 1,
      background: "transparent",
      fill: colors.shipFill,
      stroke: colors.shipStroke,
      zIndex: 20,
    },
    enter: () => async (next: (config: ShipTransitionProps) => Promise<void>) => {
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
      void inaccessibleTransitionApi.start();
    },
  }));

  useEffect(() => {
    void hitTransitionApi.start();
  }, [gridState?.hitCells]);

  useEffect(() => {
    void missTransitionApi.start();
  }, [gridState?.missedCells]);

  useEffect(() => {
    void shipTransitionApi.start();
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
        {shipTransition(({ fill, stroke, ...style }: ShipTransitionProps, item) => (
          <Ship
            ref={() => {}}
            col={item.position.x}
            row={item.position.y}
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
            col={ship.position.x}
            row={ship.position.y}
            size={ship.ship.size}
            orientation={ship.orientation}
          />
        ))}
      </GameGrid>
    </Container>
  );
};

export default LiveGameGrid;
