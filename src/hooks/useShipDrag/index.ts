import { useSelector } from 'react-redux';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useSpring, config } from '@react-spring/web';
import type { RootState } from '../../store/store';
import { Coordinates, ShipState } from '../../store/shipPlacementSlice/types';
import useBoundingRects from '../useBoundingRects';
import PlacementGridContext from '../../components/PlacementGrid/PlacementGridContext';
import { canPlaceShip } from '../../store/shipPlacementSlice/utils';

interface UseShipDragArgs {
  id: string;
  shipContainerRef: React.MutableRefObject<HTMLElement | null>;
}

const useShipDrag = ({ id, shipContainerRef }: UseShipDragArgs) => {
  const [springProps, springAPI] = useSpring(() => ({
    from: { x: 0, y: 0, scale: 1, borderColor: 'transparent' },
    config: {
      mass: 0.5,
      tension: 500,
      friction: 15,
    },
  }));

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
  ] = useBoundingRects(shipContainerRef, componentContainerRef, gridContainerRef);

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

    springAPI.start({
      to: { x: 0, y: 0, scale: 1 },
    });
  }, [springAPI]);

  const onPointerMove = useCallback((ev: React.PointerEvent) => {
    if (
      pointerId.current === null
      || shipRect === null
      || containerRect === null
      || gridRect === null
    ) return;

    const cellSize = gridRect.width / gridState.columns;
    let dx = ev.clientX - startPos.current.x;
    let dy = ev.clientY - startPos.current.y;

    if (shipRect.left + dx < containerRect.left) {
      dx = containerRect.left - shipRect.left;
    } else if (shipRect.right + dx > containerRect.right) {
      dx = containerRect.right - shipRect.right;
    }

    if (shipRect.top + dy < containerRect.top) {
      dy = containerRect.top - shipRect.top;
    } else if (shipRect.bottom + dy > containerRect.bottom) {
      dy = containerRect.bottom - shipRect.bottom;
    }

    const gridX = shipRect.left + dx - gridRect.left;
    const gridY = shipRect.top + dy - gridRect.top;

    const snapCol = Math.round(gridX / cellSize);
    const snapRow = Math.round(gridY / cellSize);

    let borderColor = 'transparent';

    if (
      snapCol >= 0
      && snapCol < gridState.columns
      && snapRow >= 0
      && snapRow < gridState.rows) {
      dx = (cellSize * snapCol) - shipRect.left + gridRect.left;
      dy = (cellSize * snapRow) - shipRect.top + gridRect.top;
      borderColor = canPlaceShip(
        gridState,
        shipState,
        { x: snapCol, y: snapRow },
      ) ? 'green'
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

  // eslint-disable-next-line arrow-body-style
  const listeners = useMemo(() => {
    return {
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerMove,
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

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
