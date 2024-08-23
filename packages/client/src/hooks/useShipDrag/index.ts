import { useDispatch, useSelector } from "react-redux";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useSpring } from "@react-spring/web";
import { useTheme } from "styled-components";
import { Coordinate } from "@battleship/common/types/__generated__/types.generated.js";
import type { RootState } from "../../store/store.js";
import useBoundingRects from "../useBoundingRects.js";
import { canPlaceShip } from "../../store/shipPlacementSlice/utils.js";
import {
  placeShip,
  resetShip,
  rotateShip,
} from "../../store/shipPlacementSlice/index.js";
import {
  calculateGridPosition,
  calculateTranslation,
  isWithinGrid,
} from "./utils.js";
import PlacementGridContext from "./PlacementGridContext.js";
import { Theme } from "../../components/assets/themes/themeDefault.js";

interface UseShipDragArgs {
  id: string;
  shipContainerRef: React.MutableRefObject<HTMLElement | null>;
}

const useShipDrag = ({ id, shipContainerRef }: UseShipDragArgs) => {
  const dispatch = useDispatch();
  const theme = useTheme() as Theme;

  const allShips = useSelector(
    (state: RootState) => state.shipPlacement.shipStates,
  );
  const gridState = useSelector(
    ({ shipPlacement }: RootState) => shipPlacement.grid,
  );
  const shipState = useSelector(({ shipPlacement }: RootState) =>
    shipPlacement.shipStates.find(({ ship }) => ship.shipID === id),
  );

  const { componentContainerRef, gridContainerRef } =
    useContext(PlacementGridContext);

  const [shipRect, containerRect, gridRect] = useBoundingRects(
    [shipContainerRef, componentContainerRef, gridContainerRef],
    [gridState, allShips],
  );

  const containerSpringStart = useMemo(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 5,
      filter: "drop-shadow(rgba(0, 0, 0, 0.2) 0px 0px 0px)",
      cursor: "grab"
    }),
    [],
  );

  const imageSpringStart = useMemo(
    () => ({
      stroke: theme.colors.shipStroke,
    }),
    [theme.colors.shipStroke],
  );

  const [containerSpring, containerSpringAPI] = useSpring(
    () => ({
      from: containerSpringStart,
      config: (key) => {
        if (key === "zIndex") {
          return {
            duration: 0,
          };
        }

        return {
          mass: 0.5,
          tension: 500,
          friction: 15,
          precision: 0.0001,
        };
      },
    }),
    [theme],
  );

  const [imageSpring, imageSpringAPI] = useSpring(
    () => ({
      from: imageSpringStart,
      config: {
        mass: 0.5,
        tension: 500,
        friction: 15,
        precision: 0.0001,
      },
    }),
    [theme, imageSpringStart],
  );

  useEffect(() => {
    void imageSpringAPI.start({ to: imageSpringStart });
  }, [imageSpringAPI, imageSpringStart]);

  const pointerId = useRef<number | null>(null);
  const startPos = useRef<Coordinate>({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (ev: React.PointerEvent) => {
      ev.currentTarget.setPointerCapture(ev.pointerId);
      pointerId.current = ev.pointerId;
      startPos.current.x = ev.clientX;
      startPos.current.y = ev.clientY;

      void containerSpringAPI.start({
        to: {
          scale: 1.2,
          zIndex: 1000,
          filter: `drop-shadow(${theme.boxShadow})`,
          cursor: "grabbing"
        },
      });
    },
    [containerSpringAPI, theme.boxShadow],
  );

  const onPointerUp = useCallback(
    (ev: React.PointerEvent) => {
      ev.currentTarget.releasePointerCapture(ev.pointerId);
      pointerId.current = null;

      if (
        shipState === undefined ||
        shipRect === null ||
        containerRect === null ||
        gridRect === null
      )
        return;

      const { dx, dy } = calculateTranslation(
        startPos.current,
        ev,
        shipRect,
        containerRect,
      );

      const { gridPosition } = calculateGridPosition(
        gridState,
        shipRect,
        gridRect,
        dx,
        dy,
      );

      if (ev.type === "pointercancel") {
        gridPosition.x = -1;
        gridPosition.y = -1;
      }

      const isPlaced = shipState.position !== null;
      const isOutsideGrid = !isWithinGrid(gridPosition, gridState);
      const canBePlaced = canPlaceShip(gridState, shipState, gridPosition);

      if (isPlaced) {
        if (canBePlaced) {
          dispatch(placeShip({ position: gridPosition, shipID: id }));
        } else if (isOutsideGrid) {
          dispatch(resetShip(id));
        }
      } else if (canBePlaced) {
        dispatch(placeShip({ position: gridPosition, shipID: id }));
      }

      void containerSpringAPI.start({ to: containerSpringStart });
      void imageSpringAPI.start({ to: imageSpringStart });
    },
    [
      id,
      dispatch,
      shipState,
      gridState,
      shipRect,
      containerRect,
      gridRect,
      containerSpringAPI,
      containerSpringStart,
      imageSpringAPI,
      imageSpringStart,
    ],
  );

  const onPointerMove = useCallback(
    (ev: React.PointerEvent) => {
      if (
        pointerId.current === null ||
        shipState === undefined ||
        shipRect === null ||
        containerRect === null ||
        gridRect === null
      )
        return;

      let { dx, dy } = calculateTranslation(
        startPos.current,
        ev,
        shipRect,
        containerRect,
      );

      const { gridPosition, dxSnapped, dySnapped } = calculateGridPosition(
        gridState,
        shipRect,
        gridRect,
        dx,
        dy,
      );

      let borderColor = theme.colors.shipStroke;
      if (isWithinGrid(gridPosition, gridState)) {
        dx = dxSnapped;
        dy = dySnapped;
        borderColor = canPlaceShip(gridState, shipState, gridPosition)
          ? theme.colors.shipBorderSuccess
          : theme.colors.shipBorderError;
      }

      void containerSpringAPI.start({
        to: {
          x: dx,
          y: dy,
        },
      });
      void imageSpringAPI.start({ to: { stroke: borderColor } });
    },
    [
      containerRect,
      gridRect,
      gridState,
      shipRect,
      shipState,
      containerSpringAPI,
      imageSpringAPI,
      theme.colors.shipStroke,
      theme.colors.shipBorderSuccess,
      theme.colors.shipBorderError,
    ],
  );

  const onDoubleClick = useCallback(() => {
    dispatch(rotateShip(id));
  }, [dispatch, id]);

  const listeners = useMemo(
    () => ({
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerMove,
      onDoubleClick,
    }),
    [onPointerDown, onPointerMove, onPointerUp, onDoubleClick],
  );

  if (shipState === undefined) return null;

  return {
    ship: shipState.ship,
    orientation: shipState.orientation,
    gridPosition: shipState.position,
    listeners,
    containerSpring,
    imageSpring,
  };
};

export default useShipDrag;
