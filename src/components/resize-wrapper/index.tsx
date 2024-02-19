import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  EditorInnerElement,
  innerElementStyle,
  innerElementsEdit,
  isSelectedWrapper,
} from '../../redux/feature/editor';

type Props = {
  children: React.ReactNode;
  elm: EditorInnerElement;
};

const ResizeWrapper = (props: Props) => {
  // const { editorWrapper, innerElement } = useSelector(
  //   (state: RootState) => state.editor.value
  // );
  const { children, elm } = props;
  const POSITION = {
    x: elm.resizeOrg.x as number,
    y: elm.resizeOrg.x as number,
  };

  const dispatch = useDispatch();

  const [state, setState] = useState({
    resizeOrg: POSITION,
    dir: -1,
    isResize: false,
    isSelected: false,
  });

  const handleWrapperMouseDown = useCallback(
    (e: React.MouseEvent, dir: number) => {
      // setState((state) => ({
      //   ...state,
      //   resizeOrg: {
      //     x: e.clientX,
      //     y: e.clientY,
      //   },
      //   dir: dir,
      //   isResize: true,
      // }));
      dispatch(
        innerElementsEdit({
          ...elm,
          resizeOrg: {
            x: e.clientX,
            y: e.clientY,
          },
          dir: dir,
          isResize: true,
        })
      );
    },
    [elm.resizeOrg]
  );

  const handleWrapperMouseMove = useCallback(
    (e: MouseEvent) => {
      if (elm.isResize) {
        const orgHeight = elm.styles.height;
        const orgWidth = elm.styles.width;

        let newHeight = orgHeight as number;
        let newWidth = orgWidth as number;
        let left = elm.styles.left as number;
        let top = elm.styles.top as number;

        switch (elm.dir) {
          case 0:
            newHeight -= e.clientY - elm.resizeOrg.y;
            top += e.clientY - elm.resizeOrg.y;
            break;
          case 1:
            newWidth += e.clientX - elm.resizeOrg.x;
            break;
          case 2:
            newHeight += e.clientY - elm.resizeOrg.y;
            break;
          case 3:
            newWidth -= e.clientX - elm.resizeOrg.x;
            left += e.clientX - elm.resizeOrg.x;
            break;
          default:
            // setState((state) => ({
            //   ...state,
            //   dir: -1,
            // }));
            dispatch(
              innerElementsEdit({
                ...elm,
                dir: -1,
              })
            );
        }

        const obj: Partial<EditorInnerElement> = {
          styles: {
            height: newHeight,
            width: newWidth,
            left: left,
            top: top,
          },
        };
        // console.log(innerElement.styles, 'from func style');
        dispatch(
          innerElementsEdit({
            ...elm,
            styles: obj.styles,
          })
        );
        // dispatch(innerElementStyle(obj));
      }
    },
    [elm.resizeOrg]
  );

  const handleWrapperMouseUp = useCallback(() => {
    // setState((state) => ({
    //   ...state,
    //   isResize: false,
    // }));

    dispatch(
      innerElementsEdit({
        ...elm,
        isResize: false,
      })
    );
  }, []);

  useEffect(() => {
    if (elm.isResize) {
      window.addEventListener('mousemove', handleWrapperMouseMove);
      window.addEventListener('mouseup', handleWrapperMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWrapperMouseMove);
      window.removeEventListener('mouseup', handleWrapperMouseUp);
    };
  }, [elm.isResize, handleWrapperMouseUp, handleWrapperMouseMove]);

  const style = useMemo(
    (): Partial<React.CSSProperties> => ({
      cursor: elm.isResize ? 'move' : '',
      transition: elm.isResize ? 'none' : 'transform 500ms',
      zIndex: 3,
      position: elm.isResize ? 'absolute' : 'relative',
      top: elm.styles.top,
      left: elm.styles.left,
      width: 'fit-content',
      userSelect: elm.isResize ? 'none' : 'element',
      opacity: elm.isResize ? 0.7 : 1,
      // border: editorWrapper.isSelected ? '2px solid black' : '',
      // padding: editorWrapper.isSelected ? 2 : 0,
      boxShadow: '0 0 0 1px #000',
    }),
    [elm.isResize, elm.isSelected]
  );

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(isSelectedWrapper(true));
  };
  return (
    <div
      onClick={handleSelect}
      style={{
        ...elm.styles,
        boxShadow: '0 0 0 1px #000',
        userSelect: elm.isResize ? 'none' : 'element',
        position: 'absolute',
      }}>
      <div
        className="relative  w-[100%] h-[100%]"
        style={{
          ...elm.styles,
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
