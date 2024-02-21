import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  EditorInnerElement,
  innerElementsEdit,
  isSelectedWrapper,
} from '../../redux/feature/editor';

type Props = {
  children: React.ReactNode;
  elm: EditorInnerElement;
};

const ResizeWrapper = (props: Props) => {
  const { children, elm } = props;
  const midTopRef = useRef<HTMLDivElement>(null);
  const midRightRef = useRef<HTMLDivElement>(null);
  const midBottomRef = useRef<HTMLDivElement>(null);
  const midLeftRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleWrapperMouseDown = useCallback(
    (e: React.MouseEvent, dir: number) => {
      if (!elm.isSelected) {
        handleSelect(e);
      }
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
    [elm]
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

        if (
          midBottomRef.current &&
          midTopRef.current &&
          midLeftRef.current &&
          midRightRef.current
        ) {
          dispatch(
            innerElementsEdit({
              ...elm,
              pointsRef: {
                midBottomRef: midBottomRef.current
                  .getBoundingClientRect()
                  .toJSON(),
                midTopRef: midTopRef.current.getBoundingClientRect().toJSON(),
                midLeftRef: midLeftRef.current.getBoundingClientRect().toJSON(),
                midRightRef: midRightRef.current
                  .getBoundingClientRect()
                  .toJSON(),
              },
              styles: {
                ...elm.styles,
                ...obj.styles,
              },
            })
          );
        } else {
          dispatch(
            innerElementsEdit({
              ...elm,
              styles: {
                ...elm.styles,
                ...obj.styles,
              },
            })
          );
        }
      }
    },
    [elm.resizeOrg]
  );

  const handleWrapperMouseUp = useCallback(() => {
    dispatch(
      innerElementsEdit({
        ...elm,
        isResize: false,
      })
    );
  }, [elm]);

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

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(
        isSelectedWrapper({
          ...elm,
        })
      );
    },
    [elm]
  );

  useEffect(() => {
    if (
      midBottomRef.current &&
      midTopRef.current &&
      midLeftRef.current &&
      midRightRef.current
    ) {
      if (
        !elm.pointsRef?.midBottomRef &&
        !elm.pointsRef?.midLeftRef &&
        !elm.pointsRef?.midRightRef &&
        !elm.pointsRef?.midTopRef
      )
        dispatch(
          innerElementsEdit({
            ...elm,
            pointsRef: {
              midBottomRef: midBottomRef.current
                .getBoundingClientRect()
                .toJSON(),
              midTopRef: midTopRef.current.getBoundingClientRect().toJSON(),
              midLeftRef: midLeftRef.current.getBoundingClientRect().toJSON(),
              midRightRef: midRightRef.current.getBoundingClientRect().toJSON(),
            },
          })
        );
    }
  }, [
    midTopRef.current,
    midLeftRef.current,
    midRightRef.current,
    midBottomRef.current,
  ]);

  return (
    <div
      onClick={handleSelect}
      style={{
        ...elm.styles,
        boxShadow: elm.isSelected ? '0 0 0 1px #000' : '0 0 0 0 ',
        userSelect: elm.isResize ? 'none' : 'element',
        position: 'absolute',
      }}
      className="resize-container">
      <div
        className="resize-inner-container relative  w-[100%] h-[100%]"
        style={{
          ...elm.styles,
          boxShadow: elm.isSelected ? '0 0 0 1px #000' : '0 0 0 0 ',
          left: 0,
          top: 0,
        }}>
        {/* mid top */}

        <div
          ref={midTopRef}
          onMouseDown={(e) => handleWrapperMouseDown(e, 0)}
          className={`absolute w-[7px] h-[7px] bg-green-500  ${
            elm.isSelected ? 'visible' : 'invisible'
          }`}
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

        {/* mid right */}

        <div
          ref={midRightRef}
          onMouseDown={(e) => handleWrapperMouseDown(e, 1)}
          className={`absolute w-[7px] h-[7px] bg-green-500  ${
            elm.isSelected ? 'visible' : 'invisible'
          }`}
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

        {/* mid bottom */}

        <div
          ref={midBottomRef}
          onMouseDown={(e) => handleWrapperMouseDown(e, 2)}
          className={`absolute w-[7px] h-[7px] bg-green-500  ${
            elm.isSelected ? 'visible' : 'invisible'
          }`}
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

        {/* mid left */}

        <div
          ref={midLeftRef}
          onMouseDown={(e) => handleWrapperMouseDown(e, 3)}
          className={`absolute w-[7px] h-[7px] bg-green-500  ${
            elm.isSelected ? 'visible' : 'invisible'
          }`}
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

export default memo(ResizeWrapper);
