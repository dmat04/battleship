/* eslint-disable arrow-body-style */
import type { Modifier } from '@dnd-kit/core';
import React from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { Coordinates } from '@dnd-kit/core/dist/types';
import { ShipDragData } from './DraggableShip';
import { dragPositionUpdate } from '../../store/shipPlacementSlice';
import { isString } from '../../utils/typeUtils';

const CustomGridModifier = (
  rows: number,
  columns: number,
  componentRef: React.MutableRefObject<HTMLDivElement | null>,
  gridRef: React.MutableRefObject<HTMLDivElement | null>,
  dispatch: Dispatch,
): Modifier => {
  let initialScroll: { scrollX: number, scrollY: number } | null = null;

  return ({
    active,
    containerNodeRect,
    transform,
  }) => {
    const componentRect = componentRef.current?.getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();

    if (initialScroll === null && active !== null) {
      initialScroll = {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      };
    }

    if (initialScroll !== null && active === null) {
      initialScroll = null;
    }

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

    const dScrollY = (initialScroll?.scrollY ?? 0) - window.scrollY;
    const dScrollX = (initialScroll?.scrollX ?? 0) - window.scrollX;

    const cellSize = gridRect.width / columns;
    let { x: dx, y: dy } = transform;

    const { size, vertical, scale } = active.data.current as ShipDragData;
    const extraHeight = vertical ? (size - 1) : 0;
    const computedContainerRect = { ...containerNodeRect };

    if (Math.abs(1 - scale) > Number.EPSILON) {
      computedContainerRect.width /= scale;
      computedContainerRect.height /= scale;
      const dWidthHalf = 0.5 * (containerNodeRect.width - computedContainerRect.width);
      const dHeightHalf = 0.5 * (containerNodeRect.height - computedContainerRect.height);

      computedContainerRect.left += dWidthHalf;
      computedContainerRect.right -= dWidthHalf;
      computedContainerRect.top += dHeightHalf;
      computedContainerRect.bottom -= dHeightHalf;
    }

    // Bound within containerRect on horizontal axis
    if (dx + computedContainerRect.left - dScrollX < componentRect.left) {
      dx = componentRect.left - computedContainerRect.left + dScrollX;
    } else if (dx + computedContainerRect.right - dScrollX > componentRect.right) {
      dx = componentRect.right - computedContainerRect.right + dScrollX;
    }

    // Bound within containerRect on vertical axis
    if (dy + computedContainerRect.top - dScrollY < componentRect.top) {
      dy = componentRect.top - computedContainerRect.top + dScrollY;
    } else if (dy + computedContainerRect.bottom - dScrollY > componentRect.bottom) {
      dy = componentRect.bottom - computedContainerRect.bottom + dScrollY;
    }

    const snapRow = Math.round((computedContainerRect.top + dy - gridRect.top) / cellSize);
    const snapCol = Math.round((computedContainerRect.left + dx - gridRect.left) / cellSize);

    const shipID = active.data.current.id;
    let position: Coordinates | null = null;

    if (snapRow >= 0 && (snapRow + extraHeight) < rows && snapCol >= 0 && snapCol < columns) {
      dx = snapCol * cellSize - computedContainerRect.left + gridRect.left;
      dy = (snapRow - rows) * cellSize - computedContainerRect.top + gridRect.bottom;

      position = { x: snapCol, y: snapRow };
    }

    if (isString(shipID)) dispatch(dragPositionUpdate({ shipID, position }));

    return {
      x: dx,
      y: dy,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
    };
  };
};

export default CustomGridModifier;
