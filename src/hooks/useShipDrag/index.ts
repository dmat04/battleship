import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useContext, useMemo, useRef,
} from 'react';
import { useSpring } from '@react-spring/web';
import type { RootState } from '../../store/store';
import { Coordinates, ShipState } from '../../store/shipPlacementSlice/types';
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
  const [springProps, springAPI] = useSpring(() => ({
    from: {
      x: 0, y: 0, scale: 1, borderColor: 'transparent',
    },
    config: {
      mass: 0.5,
      tension: 500,
      friction: 15,
    },
  }));

  const dispatch = useDispatch();

  // eslint-disable-next-line arrow-body-style
  const shipState = useSelector(({ shipPlacement }: RootState) => {
    return shipPlacement.shipStates.find(({ shipID }: ShipState) => shipID === id);
  }) as ShipState;

  const gridState = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid);

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
    gridState,
    shipState,
  );

  const pointerId = useRef<number | null>(null);
  const pointerDownTime = useRef<number>(Number.MAX_VALUE);
  const startPos = useRef<Coordinates>({ x: 0, y: 0 });

  const onPointerDown = useCallback((ev: React.PointerEvent) => {
    ev.currentTarget.setPointerCapture(ev.pointerId);
    pointerId.current = ev.pointerId;
    pointerDownTime.current = ev.timeStamp;
    startPos.current.x = ev.clientX;
    startPos.current.y = ev.clientY;
  }, []);

  const onPointerUp = useCallback((ev: React.PointerEvent) => {
    ev.currentTarget.releasePointerCapture(ev.pointerId);
    pointerId.current = null;

    if (ev.timeStamp - pointerDownTime.current < 500) return;

    if (
      shipRect === null
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

    if (canBePlaced) {
      springAPI.start({
        to: { scale: 1, borderColor: 'transparent' },
      });
      dispatch(placeShip({ position: gridPosition, shipID: id }));
    } else if (isPlaced && isOutsideGrid) {
      dispatch(resetShip(id));
    } else {
      springAPI.start({
        to: { x: 0, y: 0, scale: 1 },
      });
    }
  }, [containerRect, dispatch, gridRect, gridState, id, shipRect, shipState, springAPI]);

  const onPointerMove = useCallback((ev: React.PointerEvent) => {
    if (
      pointerId.current === null
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
