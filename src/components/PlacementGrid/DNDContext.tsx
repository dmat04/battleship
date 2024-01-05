import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import CustomGridModifier from './CustomGridModifier';
import PlacementGridContext from './PlacementGridContext';
import { dragEnd, dragStart } from '../../store/shipPlacementSlice';
import customCollisionDetector from './CustomCollisionDetector';
import { Coordinates } from '../../store/shipPlacementSlice/types';
import { ShipDragData } from './DraggableShip';

interface PropTypes {
  children: React.ReactNode;
}

const DNDContext = ({ children }: PropTypes) => {
  const { componentContainerRef, gridContainerRef } = useContext(PlacementGridContext);
  const dispatch = useDispatch();

  const activationConstraint = {
    delay: 150,
    distance: 0,
    tolerance: 100,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const modifiers = [
    CustomGridModifier(10, 10, componentContainerRef, gridContainerRef, dispatch),
  ];

  const handleDragEnd = (ev: DragEndEvent) => {
    const { id } = ev.active.data.current as ShipDragData;
    let position: Coordinates | null = null;

    const { column, row } = ev.over?.data.current ?? {};
    if (column !== undefined && row !== undefined) {
      position = {
        x: column,
        y: row,
      };
    }

    dispatch(dragEnd({ shipID: id, position }));
  };

  const handleDragStart = (ev: DragStartEvent) => {
    if (ev.active?.data?.current?.id !== undefined) {
      dispatch(dragStart(ev.active.data.current.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      collisionDetection={customCollisionDetector}
      // collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      // onDragMove={(ev) => console.log('MOVE', ev)}
      // onDragOver={(ev) => console.log('OVER', ev)}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

export default DNDContext;
