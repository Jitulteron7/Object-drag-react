import React, { useCallback, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type PositionType = {
  x: number;
  y: number;
};
const POSITION: PositionType = {
  x: 0,
  y: 0,
};

const DragWrapper = (props: Props) => {
  const { children } = props;
  const [propertyState, setPropertyState] = useState({
    dragging: false,
    origin: POSITION,
    translation: POSITION,
  });

  const dragStart = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setPropertyState((state) => ({
      ...state,
      dragging: true,
      origin: { x: clientX, y: clientY },
    }));
  }, []);

  

  const dragging = (e: React.MouseEvent) => {
    console.log('dragging');
    if (propertyState.dragging) {
      const left = e.screenX - propertyState.diffX;
      const top = e.screenY - propertyState.diffY;

      setPropertyState({
        ...propertyState,
        styles: {
          left: left,
          top: top,
        },
      });
    }
  };

  const onDragEnd = () => {
    console.log('onDragEnd');
    setPropertyState({
      ...propertyState,
      dragging: false,
    });
  };

  return (
    <div
      className={`absolute cursor-move top-0 left-0 w-[200px] h-[200px] flex justify-center items-center ${
        propertyState.dragging ? 'bg-blue-500' : 'bg-yellow-500'
      } ${propertyState.dragging ? 'user-select:none' : ''}`}
      style={{ ...propertyState.styles }}
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={onDragEnd}>
      {children}
    </div>
  );
};

export default DragWrapper;
