/* eslint-disable arrow-body-style */
import type { Modifier } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import React from 'react';
import { ShipDragData } from './DraggableShip';

const CustomGridModifier = (
  rows: number,
  columns: number,
  componentRef: React.MutableRefObject<HTMLDivElement | null>,
  gridRef: React.MutableRefObject<HTMLDivElement | null>,
): Modifier => {
  return ({
    activeNodeRect,
    transform,
    active,
  }) => {
    const componentRect = componentRef.current?.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    if (
      activeNodeRect === null
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

    // const transformedNode = {
    //   top: activeNodeRect.top + dy,
    //   bottom: activeNodeRect.bottom + dy,
    //   left: activeNodeRect.left + dx,
    //   right: activeNodeRect.right + dx,
    // };

    // console.log('\n');
    // console.log('CONTAINER', containerRect);
    // console.log('NODE', activeNodeRect);
    // console.log('TRANSFORMED NODE', transformedNode);

    const shipData = active.data.current as ShipDragData;
    const extraHeight = shipData.vertical ? (shipData.size - 1) : 0;

    // Bound within containerRect on horizontal axis
    if (dx + activeNodeRect.left < componentRect.left) {
      dx = componentRect.left - activeNodeRect.left;
    } else if (dx + activeNodeRect.right > componentRect.right) {
      dx = componentRect.right - activeNodeRect.right;
    }

    // Bound within containerRect on vertical axis
    if (dy + activeNodeRect.top < componentRect.top) {
      dy = componentRect.top - activeNodeRect.top;
    } else if (dy + activeNodeRect.bottom > componentRect.bottom) {
      dy = componentRect.bottom - activeNodeRect.bottom;
    }

    const snapRow = Math.round((activeNodeRect.top + dy - gridRect.top) / cellSize);
    const snapCol = Math.round((activeNodeRect.left + dx - gridRect.left) / cellSize);

    if (snapRow >= 0 && (snapRow + extraHeight) < rows && snapCol >= 0 && snapCol < columns) {
      dx = snapCol * cellSize - activeNodeRect.left + gridRect.left;
      dy = (snapRow - rows) * cellSize - activeNodeRect.top + gridRect.bottom;
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
