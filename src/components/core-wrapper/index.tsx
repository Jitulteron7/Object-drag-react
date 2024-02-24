import React, { memo } from 'react';

import { EditorInnerElement } from '../../redux/feature/editor';
import { useDragHook } from '../../hooks/drag-wrapper-hook';
import { useResizeHook } from '../../hooks/resize-wrapper-hook';

type Props = {
  children: React.ReactNode;
  elm: EditorInnerElement;
};

const ResizeWrapper = (props: Props) => {
  const { children, elm } = props;

  const {
    handleWrapperMouseDown,
    handleSelect,
    setMidBottomRef: setMidBottomRHRef,
    setMidLeftRef: setMidLeftRHTop,
    setMidRightRef: setMidRightRHRef,
    setMidTopRef: setMidTopRHpRef,
  } = useResizeHook(elm);

  const {
    handleMouseDown,
    setMidBottomRef: setMidBottomDHRef,
    setMidRightRef: setMidRightDHRef,
    setMidLeftRef: setMidLeftDHRef,
    setMidTopRef: setMidTopDHRef,
  } = useDragHook(elm);

  const setMidBottomRef = (ref: HTMLDivElement) => {
    setMidBottomRHRef(ref);
    setMidBottomDHRef(ref);
  };
  const setMidLeftRef = (ref: HTMLDivElement) => {
    setMidLeftRHTop(ref);
    setMidLeftDHRef(ref);
  };
  const setMidRightRef = (ref: HTMLDivElement) => {
    setMidRightRHRef(ref);
    setMidRightDHRef(ref);
  };
  const setMidTopRef = (ref: HTMLDivElement) => {
    setMidTopRHpRef(ref);
    setMidTopDHRef(ref);
  };

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
          ref={setMidTopRef}
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
          ref={setMidRightRef}
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
          ref={setMidBottomRef}
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
          ref={setMidLeftRef}
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

        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          onClick={handleSelect}
          onMouseDown={handleMouseDown}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(ResizeWrapper);
