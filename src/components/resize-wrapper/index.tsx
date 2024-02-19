import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  EditorInnerElement,
  innerElementStyle,
  isSelectedWrapper,
} from '../../redux/feature/editor';

type Props = {
  children: React.ReactNode;
};

const POSITION = {
  x: 100,
  y: 100,
};
const ResizeWrapper = (props: Props) => {
  const { editorWrapper, innerElement } = useSelector(
    (state: RootState) => state.editor.value
  );

  const dispatch = useDispatch();

  const { children } = props;
  const [state, setState] = useState({
    origin: POSITION,
    resizeOrg: POSITION,
    dir: -1,
    isResize: false,
    isSelected: false,
  });

  const handleWrapperMouseDown = useCallback(
    (e: React.MouseEvent, dir: number) => {
      console.log(e.clientX, 'clietx');

      setState((state) => ({
        ...state,
        resizeOrg: {
          x: e.clientX,
          y: e.clientY,
        },
        dir: dir,
        isResize: true,
      }));
    },
    [state.resizeOrg]
  );

  const handleWrapperMouseMove = useCallback(
    (e: MouseEvent) => {
      if (state.isResize) {
        const orgHeight = innerElement.styles.height;
        const orgWidth = innerElement.styles.width;

        console.log('direction', state.dir);

        let newHeight = orgHeight as number;
        let newWidth = orgWidth as number;
        let left = innerElement.styles.left as number;
        let top = innerElement.styles.top as number;

        switch (state.dir) {
          case 0:
            newHeight -= e.clientY - state.resizeOrg.y;
            top += e.clientY - state.resizeOrg.y;
            break;
          case 1:
            newWidth += e.clientX - state.resizeOrg.x;
            break;
          case 2:
            newHeight += e.clientY - state.resizeOrg.y;
            break;
          case 3:
            newWidth -= e.clientX - state.resizeOrg.x;
            left += e.clientX - state.resizeOrg.x;
            break;
          default:
            setState((state) => ({
              ...state,
              dir: -1,
            }));
        }

        const testing = {
          height: newHeight,
          width: newWidth,
        };

        console.log(testing, 'testing');

        const obj: Partial<EditorInnerElement> = {
          styles: {
            height: newHeight,
            width: newWidth,
            left: left,
            top: top,
          },
        };
        console.log(innerElement.styles, 'from func style');
        dispatch(innerElementStyle(obj));
      }
    },
    [state.resizeOrg]
  );

  const handleWrapperMouseUp = useCallback(() => {
    setState((state) => ({
      ...state,
      isResize: false,
    }));
  }, []);

  useEffect(() => {
    if (state.isResize) {
      window.addEventListener('mousemove', handleWrapperMouseMove);
      window.addEventListener('mouseup', handleWrapperMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWrapperMouseMove);
      window.removeEventListener('mouseup', handleWrapperMouseUp);
    };
  }, [state.isResize, handleWrapperMouseUp, handleWrapperMouseMove]);

  const style = useMemo(
    (): Partial<React.CSSProperties> => ({
      cursor: state.isResize ? 'move' : '',
      transition: state.isResize ? 'none' : 'transform 500ms',
      zIndex: 3,
      position: state.isResize ? 'absolute' : 'relative',
      top: innerElement.styles.top,
      left: innerElement.styles.left,
      width: 'fit-content',
      userSelect: state.isResize ? 'none' : 'element',
      opacity: state.isResize ? 0.7 : 1,
      // border: editorWrapper.isSelected ? '2px solid black' : '',
      // padding: editorWrapper.isSelected ? 2 : 0,
      boxShadow: '0 0 0 1px #000',
    }),
    [state.isResize, editorWrapper.isSelected]
  );

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(isSelectedWrapper(true));
  };
  return (
    <div
      onClick={handleSelect}
      style={{
        ...innerElement.styles,
        boxShadow: '0 0 0 1px #000',
        userSelect: state.isResize ? 'none' : 'element',
        position: 'absolute',
      }}>
      <div
        className="relative  w-[100%] h-[100%]"
        style={{
          ...innerElement.styles,
          left: 0,
          top: 0,
        }}>
        <div
          onMouseDown={(e) => handleWrapperMouseDown(e, 0)}
          className="absolute w-[7px] h-[7px] bg-green-500"
          style={{
            top: '-4px',
            left: 'calc(50% - 2.5px)',
            zIndex: 2,
            cursor: 'n-resize',
            pointerEvents: 'all',
            border: '1px solid #fff',
            borderRadius: 0,
          }}
        />
        <div
          onMouseDown={(e) => handleWrapperMouseDown(e, 1)}
          className="absolute w-[7px] h-[7px] bg-green-500"
          style={{
            top: 'calc(50% - 2.5px)',
            left: 'calc(100% - 2.5px)',
            zIndex: 2,
            cursor: 'e-resize',
            pointerEvents: 'all',
            border: '1px solid #fff',
            borderRadius: 0,
          }}
        />
        <div
          onMouseDown={(e) => handleWrapperMouseDown(e, 2)}
          className="absolute w-[7px] h-[7px] bg-green-500"
          style={{
            top: 'calc(100% - 2.5px)',
            left: 'calc(50% - 2.5px)',
            zIndex: 2,
            cursor: 's-resize',
            pointerEvents: 'all',
            border: '1px solid #fff',
            borderRadius: 0,
          }}
        />
        <div
          onMouseDown={(e) => handleWrapperMouseDown(e, 3)}
          className="absolute w-[7px] h-[7px] bg-green-500"
          style={{
            top: 'calc(50% - 2.5px)',
            left: '-2.5px',
            zIndex: 2,
            cursor: 'w-resize',
            pointerEvents: 'all',
            border: '1px solid #fff',
            borderRadius: 0,
          }}
        />

        {children}
      </div>
    </div>
  );
};

export default ResizeWrapper;
