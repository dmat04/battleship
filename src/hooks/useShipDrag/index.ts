import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useContext, useMemo, useRef,
} from 'react';
import { useSpring } from '@react-spring/web';
import type { RootState } from '../../store/store';
import { Coordinates } from '../../store/shipPlacementSlice/types';
import useBoundingRects from '../useBoundingRects';
import PlacementGridContext from '../../components/PlacementGrid/PlacementGridContext';
import { canPlaceShip } from '../../store/shipPlacementSlice/utils';
import { placeShip, resetShip, rotateShip } from '../../store/shipPlacementSlice';
import { calculateGridPosition, calculateTranslation, isWithinGrid } from './utils';

interface UseShipDragArgs {
  id: string;
  shipContainerRef: React.MutableRefObject<HTMLElement | null>;
}

const useShipDrag = ({ id, shipContainerRef }: UseShipDragArgs) => {
  const dispatch = useDispatch();

  // eslint-disable-next-line arrow-body-style
  const shipStates = useSelector(({ shipPlacement }: RootState) => {
    return shipPlacement.shipStates;
  });

  const gridState = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid);

  const shipState = shipStates.find((ship) => ship.shipID === id);

  const {
    componentContainerRef,
    gridContainerRef,
  } = useContext(PlacementGridContext);

  const [
    shipRect,
    containerRect,
    gridRect,
  ] = useBoundingRects(
    [shipContainerRef, componentContainerRef, gridContainerRef],
    [gridState, shipStates, shipState?.position],
  );

  const springStart = useMemo(() => ({
    x: 0,
    y: 0,
    scale: 1,
    borderColor: 'transparent',
  }), []);

  const [springProps, springAPI] = useSpring(
    () => ({
      from: springStart,
      config: {
        mass: 0.5,
        tension: 500,
        friction: 15,
        precision: 0.0001,
      },
    }),
    [shipState],
  );

  const pointerId = useRef<number | null>(null);
  const startPos = useRef<Coordinates>({ x: 0, y: 0 });

  const onPointerDown = useCallback((ev: React.PointerEvent) => {
    ev.currentTarget.setPointerCapture(ev.pointerId);
    pointerId.current = ev.pointerId;
    startPos.current.x = ev.clientX;
    startPos.current.y = ev.clientY;
  }, []);

  const onPointerUp = useCallback((ev: React.PointerEvent) => {
    ev.currentTarget.releasePointerCapture(ev.pointerId);
    pointerId.current = null;

    if (
      shipState === undefined
      || shipRect === null
      || containerRect === null
      || gridRect === null
    ) return;

    const { dx, dy } = calculateTranslation(startPos.current, ev, shipRect, containerRect);

    const {
      gridPosition,
    } = calculateGridPosition(gridState, shipRect, gridRect, dx, dy);

    const isPlaced = shipState.position !== null;
    const isOutsideGrid = !isWithinGrid(gridPosition, gridState);
    const canBePlaced = canPlaceShip(gridState, shipState, gridPosition);

    if (isPlaced) {
      if (canBePlaced) {
        dispatch(placeShip({ position: gridPosition, shipID: id }));
      } else if (isOutsideGrid) {
        dispatch(resetShip(id));
      } else {
        springAPI.start({ to: springStart });
      }
    } else if (canBePlaced) {
      dispatch(placeShip({ position: gridPosition, shipID: id }));
    } else {
      springAPI.start({ to: springStart });
    }
  }, [
    containerRect,
    dispatch,
    gridRect,
    gridState,
    id,
    shipRect,
    shipState,
    springAPI,
    springStart,
  ]);

  const onPointerMove = useCallback((ev: React.PointerEvent) => {
    if (
      pointerId.current === null
      || shipState === undefined
      || shipRect === null
      || containerRect === null
      || gridRect === null
    ) return;

    let { dx, dy } = calculateTranslation(startPos.current, ev, shipRect, containerRect);

    const {
      gridPosition,
      dxSnapped,
      dySnapped,
    } = calculateGridPosition(gridState, shipRect, gridRect, dx, dy);

    let borderColor = 'transparent';
    if (isWithinGrid(gridPosition, gridState)) {
      dx = dxSnapped;
      dy = dySnapped;
      borderColor = canPlaceShip(gridState, shipState, gridPosition)
        ? 'green'
        : 'red';
    }

    springAPI.start({
      to: {
        x: dx,
        y: dy,
        scale: 1.2,
        borderColor,
      },
    });
  }, [containerRect, gridRect, gridState, shipRect, shipState, springAPI]);

  const onDoubleClick = useCallback(() => {
    dispatch(rotateShip(id));
  }, [dispatch, id]);

  // eslint-disable-next-line arrow-body-style
  const listeners = useMemo(() => {
    return {
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerMove,
      onDoubleClick,
    };
  }, [onPointerDown, onPointerMove, onPointerUp, onDoubleClick]);

  if (shipState === undefined) return null;

  return {
    shipClass: shipState.shipClass,
    orientation: shipState.orientation,
    gridPosition: shipState.position,
    listeners,
    springProps,
  };
};

export default useShipDrag;
