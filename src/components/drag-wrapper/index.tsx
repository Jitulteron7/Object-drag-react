import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { innerElementStyle } from '../../redux/feature/editor';

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

  const dispatch = useDispatch();
  const { innerElement } = useSelector(
    (state: RootState) => state.editor.value
  );
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top } = (e.target as Element).getBoundingClientRect();

    setState((state) => ({
      ...state,
      isDragging: true,
      origin: {
        x: clientX - left,
        y: clientY - top,
      },
    }));
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      console.log('mouse movement', e.clientX - e.offsetX, e.pageX);

      const { clientX, clientY } = e;
      if (state.isDragging) {
        const translation = {
          x: clientX - state.origin.x,
          y: clientY - state.origin.y,
        };

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
      top: state.tranlation.y,
      left: state.tranlation.x,
      transition: state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? '2' : '1',
      position: state.isDragging ? 'absolute' : 'relative',
      userSelect: state.isDragging ? 'none' : 'element',
      opacity: state.isDragging ? 0.7 : 1,
    }),
    [state.isDragging, state.tranlation]
  );

  useEffect(() => {
    const obj = {
      styles: {
        ...style,
      },
    };
    dispatch(innerElementStyle(obj));
  }, [style]);

  const elmRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={elmRef}
      style={{
        width: '100%',
        height: '100%',
      }}
      // onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DragWrapper;
