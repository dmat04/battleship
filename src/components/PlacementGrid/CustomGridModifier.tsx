import { Modifier } from '@dnd-kit/core';
import React from 'react';

const CustomGridModifier = (
  rows: number,
  columns: number,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
): Modifier => (
  //   {
  //   containerNodeRect,
  //   activeNodeRect,
  //   transform,
  //   active,
  // }
  args,
) => {
    console.log(containerRef.current?.getBoundingClientRect());
    console.log(args);
    //if (activeNodeRect === null || active === null) return;

    // const boundingRect = boundingNodeRef.current?.getBoundingClientRect();
    // const gridRect = gridContainer.current?.getBoundingClientRect();
    // const ship = active.data.current.shipPlacement;
    // const extraHeight = ship.orientation === 'horizontal'
    //   ? 0
    //   : ship.shipType.size - 1;

    // if (transform.x + activeNodeRect.left < boundingRect.left) {
    //   transform.x = boundingRect.left - activeNodeRect.left;
    // } else if (transform.x + activeNodeRect.right > boundingRect.right) {
    //   transform.x = boundingRect.right - activeNodeRect.right;
    // }

    // if (transform.y + activeNodeRect.top < boundingRect.top) {
    //   transform.y = boundingRect.top - activeNodeRect.top;
    // } else if (transform.y + activeNodeRect.bottom > boundingRect.bottom) {
    //   transform.y = boundingRect.bottom - activeNodeRect.bottom;
    // }

    // const [row, col] = [
    //   Math.round((activeNodeRect.top + transform.y - gridRect.top) / cellSize),
    //   Math.round((activeNodeRect.left + transform.x - gridRect.left) / cellSize),
    // ];

    // if (row >= 0 && (row + extraHeight) < rows && col >= 0 && col < columns) {
    //   transform.x = col * cellSize - activeNodeRect.left + boundingRect.left;
    //   transform.y = (row - rows) * cellSize - activeNodeRect.top + gridRect.bottom;
    // }

    return args.transform;
  };

export default CustomGridModifier;
