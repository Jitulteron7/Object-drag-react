import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const POSITION = {
  x: 0,
  y: 0,
};
const DragWrapper = (props: Props) => {
  const { children } = props;
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    tranlation: POSITION,
  });

  const handleMouseDown = useCallback(
    ({ clientX, clientY }: React.MouseEvent) => {
      console.log('mouse down', clientX, clientY);

      setState((state) => ({
        ...state,
        isDragging: true,
        origin: {
          x: state.origin.x != 0 ? state.origin.x : clientX,
          y: state.origin.y != 0 ? state.origin.y : clientY,
        },
      }));
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (state.isDragging) {
        const translation = {
          x: clientX - state.origin.x,
          y: clientY - state.origin.y,
        };
        console.log('mouse move', translation);
        setState((state) => ({
          ...state,
          tranlation: translation,
        }));
      }
    },
    [state.origin]
  );

  const handleMouseUp = useCallback(() => {
    console.log('mouse up');
    setState((state) => ({
      ...state,
      isDragging: false,
    }));
  }, []);

  useEffect(() => {
    console.log(state.isDragging, 'state.isDragging');

    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging, handleMouseUp, handleMouseMove]);

  const style = useMemo(
    (): Partial<React.CSSProperties> => ({
      cursor: state.isDragging ? 'move' : '',
      transform: `translate(${state.tranlation.x}px, ${state.tranlation.y}px)`,
      transition: state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? '2' : '1',
      position: state.isDragging ? 'absolute' : 'relative',
      width: 'fit-content',
      userSelect: state.isDragging ? 'none' : 'element',
    }),
    [state.isDragging, state.tranlation]
  );

  return (
    <div style={{ ...style }} onMouseDown={handleMouseDown} className="">
      {children}
    </div>
  );
};

export default DragWrapper;
