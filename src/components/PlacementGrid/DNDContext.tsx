import {
  DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors,
} from '@dnd-kit/core';
import CustomGridModifier from './CustomGridModifier';
import CustomGridColisionDetection from './CustomGridColisionDetection';

interface PropTypes {
  children: React.ReactNode;
}

const DNDContext = ({ children }: PropTypes) => {
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
    CustomGridModifier(10, 10),
  ];

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      collisionDetection={closestCenter}
      // onDragStart={(ev) => console.log('START', ev)}
      // onDragMove={(ev) => console.log('MOVE', ev)}
      // onDragOver={(ev) => console.log('OVER', ev)}
      // onDragEnd={(ev) => console.log('END', ev)}
    >
      { children }
    </DndContext>
  );
};

export default DNDContext;
