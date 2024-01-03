/* eslint-disable arrow-body-style */
import type { Modifier } from '@dnd-kit/core';
import React from 'react';
import { ShipDragData } from './DraggableShip';

const CustomGridModifier = (
  rows: number,
  columns: number,
  componentRef: React.MutableRefObject<HTMLDivElement | null>,
  gridRef: React.MutableRefObject<HTMLDivElement | null>,
): Modifier => {
  return ({
    active,
    containerNodeRect,
    transform,
  }) => {
    const componentRect = componentRef.current?.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    if (
      containerNodeRect === null
      || active === null
      || active.data.current === undefined
      || componentRect === undefined
      || gridRect === undefined
    ) {
      return {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      };
    }

    const cellSize = gridRect.width / columns;
    let { x: dx, y: dy } = transform;

    const shipData = active.data.current as ShipDragData;
    const extraHeight = shipData.vertical ? (shipData.size - 1) : 0;

    // Bound within containerRect on horizontal axis
    if (dx + containerNodeRect.left < componentRect.left) {
      dx = componentRect.left - containerNodeRect.left;
    } else if (dx + containerNodeRect.right > componentRect.right) {
      dx = componentRect.right - containerNodeRect.right;
    }

    // Bound within containerRect on vertical axis
    if (dy + containerNodeRect.top < componentRect.top) {
      dy = componentRect.top - containerNodeRect.top;
    } else if (dy + containerNodeRect.bottom > componentRect.bottom) {
      dy = componentRect.bottom - containerNodeRect.bottom;
    }

    const snapRow = Math.round((containerNodeRect.top + dy - gridRect.top) / cellSize);
    const snapCol = Math.round((containerNodeRect.left + dx - gridRect.left) / cellSize);

    if (snapRow >= 0 && (snapRow + extraHeight) < rows && snapCol >= 0 && snapCol < columns) {
      dx = snapCol * cellSize - containerNodeRect.left + gridRect.left;
      dy = (snapRow - rows) * cellSize - containerNodeRect.top + gridRect.bottom;
    }

    return {
      x: dx,
      y: dy,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
    };
  };
};

export default CustomGridModifier;
