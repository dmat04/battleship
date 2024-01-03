import {
  DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors,
} from '@dnd-kit/core';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import CustomGridModifier from './CustomGridModifier';
import PlacementGridContext from './PlacementGridContext';
import { placeShip } from '../../store/shipPlacementSlice';

interface PropTypes {
  children: React.ReactNode;
}

const DNDContext = ({ children }: PropTypes) => {
  const { componentContainerRef, gridContainerRef } = useContext(PlacementGridContext);
  const dispatch = useDispatch();

  const activationConstraint = {
    delay: 250,
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
    CustomGridModifier(10, 10, componentContainerRef, gridContainerRef),
  ];

  const handleDragEnd = (ev: DragEndEvent) => {
    if (!ev.over?.data.current) return;

    const { id } = ev.active.data.current;
    const { row, column } = ev.over.data.current;

    dispatch(placeShip({
      shipID: id,
      position: { x: column, y: row },
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      collisionDetection={closestCenter}
      // onDragStart={(ev) => console.log('START', ev)}
      // onDragMove={(ev) => console.log('MOVE', ev)}
      // onDragOver={(ev) => console.log('OVER', ev)}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

export default DNDContext;
