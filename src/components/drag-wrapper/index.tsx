import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const DragWrapper = (props: Props) => {
  const { children } = props;
  const [propertyState, setPropertyState] = useState({
    diffX: 0,
    diffY: 0,
    dragging: false,
    styles: {},
  });

  const dragStart = (e: React.MouseEvent) => {
    console.log('dragStart');

    const diffX = e.screenX - e.currentTarget.getBoundingClientRect().left;
    const diffY = e.screenY - e.currentTarget.getBoundingClientRect().top;

    setPropertyState({
      ...propertyState,
      diffX,
      diffY,
      dragging: true,
    });
  };

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
