import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  EditorInnerElement,
  innerElementStyle,
  innerElementsEdit,
} from '../../redux/feature/editor';

type Props = {
  children: React.ReactNode;
  elm: EditorInnerElement;
};

const DragWrapper = (props: Props) => {
  const { children, elm } = props;
  const { innerElement } = useSelector(
    (state: RootState) => state.editor.value
  );

  const POSITION = {
    x: elm.origin.x as number,
    y: elm.origin.y as number,
  };
  const [state, setState] = useState({
    isDragging: false,
    origin: POSITION,
    tranlation: POSITION,
  });

  const dispatch = useDispatch();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top } = (e.target as Element).getBoundingClientRect();

    // setState((state) => ({
    //   ...state,
    //   isDragging: true,
    //   origin: {
    //     x: clientX - left,
    //     y: clientY - top,
    //   },
    // }));

    dispatch(
      innerElementsEdit({
        ...elm,
        isDragging: true,
        origin: {
          x: clientX - left,
          y: clientY - top,
        },
      })
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      console.log('mouse movement', e.clientX - e.offsetX, e.pageX);

      const { clientX, clientY } = e;
      if (elm.isDragging) {
        const translation = {
          x: clientX - elm.origin.x,
          y: clientY - elm.origin.y,
        };

        // setState((state) => ({
        //   ...state,
        //   tranlation: translation,
        // }));

        dispatch(
          innerElementsEdit({
            ...elm,
            tranlation: translation,
          })
        );
      }
    },
    [elm.origin]
  );

  const handleMouseUp = useCallback(() => {
    console.log('mouse up');

    dispatch(
      innerElementsEdit({
        ...elm,
        isDragging: false,
      })
    );
  }, []);

  useEffect(() => {
    if (elm.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [elm.isDragging, handleMouseUp, handleMouseMove]);

  const style = useMemo(
    (): Partial<React.CSSProperties> => ({
      cursor: elm.isDragging ? 'move' : '',
      top: elm?.tranlation?.y,
      left: elm?.tranlation?.x,
      transition: elm.isDragging ? 'none' : 'transform 500ms',
      zIndex: elm.isDragging ? '2' : '1',
      position: elm.isDragging ? 'absolute' : 'relative',
      userSelect: elm.isDragging ? 'none' : 'element',
      opacity: elm.isDragging ? 0.7 : 1,
    }),
    [elm.isDragging, elm.tranlation]
  );

  useEffect(() => {
    const obj = {
      styles: {
        ...style,
      },
    };

    dispatch(
      innerElementsEdit({
        ...elm,
        styles: obj.styles,
      })
    );
  }, [style]);

  const elmRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={elmRef}
      style={{
        width: '100%',
        height: '100%',
      }}
      onMouseDown={handleMouseDown}>
      {children}
    </div>
  );
};

export default DragWrapper;
