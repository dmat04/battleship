import { useSelector } from 'react-redux';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useSpring, config } from '@react-spring/web';
import type { RootState } from '../../store/store';
import { Coordinates, ShipState } from '../../store/shipPlacementSlice/types';
import useBoundingRects from '../useBoundingRects';
import PlacementGridContext from '../../components/PlacementGrid/PlacementGridContext';

interface UseShipDragArgs {
  id: string;
  shipContainerRef: React.MutableRefObject<HTMLElement | null>;
}

const useShipDrag = ({ id, shipContainerRef }: UseShipDragArgs) => {
  const [springProps, springAPI] = useSpring(() => ({
    from: { x: 0, y: 0, scale: 1 },
    config: {
      mass: 0.5,
      tension: 500,
      friction: 15,
    },
  }));

  // eslint-disable-next-line arrow-body-style
  const placementState = useSelector(({ shipPlacement }: RootState) => {
    return shipPlacement.shipStates.find(({ shipID }: ShipState) => shipID === id);
  }) as ShipState;

  const gridState = useSelector(({ shipPlacement }: RootState) => shipPlacement.grid);

  const {
    componentContainerRef,
    gridContainerRef,
  } = useContext(PlacementGridContext);

  const {
    viewport,
    containerRect,
    gridRect,
  } = useBoundingRects(componentContainerRef, gridContainerRef);

  const shipRect = useMemo(
    () => shipContainerRef.current?.getBoundingClientRect(),
    [shipContainerRef, shipContainerRef.current],
  );

  const pointerId = useRef<number | null>(null);
  const pointerOffset = useRef<Coordinates>({ x: 0, y: 0 });
  const startPos = useRef<Coordinates>({ x: 0, y: 0 });

  const onPointerDown = useCallback((ev: React.PointerEvent) => {
    ev.currentTarget.setPointerCapture(ev.pointerId);
    pointerId.current = ev.pointerId;
    pointerOffset.current.x = ev.nativeEvent.offsetX;
    pointerOffset.current.y = ev.nativeEvent.offsetY;
    startPos.current.x = ev.clientX;
    startPos.current.y = ev.clientY;
  }, []);

  const onPointerUp = useCallback((ev: React.PointerEvent) => {
    ev.currentTarget.releasePointerCapture(ev.pointerId);
    pointerId.current = null;

    springAPI.start({
      to: { x: 0, y: 0, scale: 1 },
    });
  }, []);

  const onPointerMove = useCallback((ev: React.PointerEvent) => {
    if (pointerId.current === null) return;

    const dx = ev.clientX - startPos.current.x;
    const dy = ev.clientY - startPos.current.y;

    springAPI.start({
      to: { x: dx, y: dy, scale: 1.2 },
    });
  }, []);

  // eslint-disable-next-line arrow-body-style
  const listeners = useMemo(() => {
    return {
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerMove,
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

  if (placementState === undefined) return null;

  return {
    shipClass: placementState.shipClass,
    orientation: placementState.orientation,
    gridPosition: placementState.position,
    listeners,
    springProps,
  };
};

export default useShipDrag;
