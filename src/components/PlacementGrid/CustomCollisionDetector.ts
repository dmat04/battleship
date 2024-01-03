import { ClientRect, CollisionDetection } from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/core/dist/types';

const rectCenter = (rect: ClientRect): Coordinates => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

const customCollisionDetector: CollisionDetection = ({
  collisionRect,
  droppableContainers,
}) => {
  const draggableCenter = rectCenter(collisionRect);

  const collision = droppableContainers.find((container) => {
    const droppableRect = container.rect.current;
    if (!droppableRect) return false;

    const droppableCenter = rectCenter(droppableRect);
    const dx = Math.abs(droppableCenter.x - draggableCenter.x);
    const dy = Math.abs(droppableCenter.y - draggableCenter.y);

    if (dx <= droppableRect.width / 2 && dy <= droppableRect.height / 2) {
      return true;
    }

    return false;
  });

  if (collision) {
    return [{
      id: collision.id,
      data: {
        droppableContainer: collision,
        value: 0,
      },
    }];
  }

  return [];
};

export default customCollisionDetector;
