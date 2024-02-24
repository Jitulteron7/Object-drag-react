import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  EditorInnerElement,
  innerElementsEdit,
  isSelectedWrapper,
  setActiveElm,
} from '../redux/feature/editor';
import { useDispatch } from 'react-redux';

export const useDragHook = (elm: EditorInnerElement) => {
  const midTopRef = useRef<HTMLDivElement | null>(null);
  const midRightRef = useRef<HTMLDivElement | null>(null);
  const midBottomRef = useRef<HTMLDivElement | null>(null);
  const midLeftRef = useRef<HTMLDivElement | null>(null);

  const setMidTopRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    midTopRef.current = ref;
  };
  const setMidRightRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    midRightRef.current = ref;
  };
  const setMidBottomRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    midBottomRef.current = ref;
  };
  const setMidLeftRef = (ref: HTMLDivElement) => {
    if (!ref) return;
    midLeftRef.current = ref;
  };

  const dispatch = useDispatch();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!elm.isSelected) {
        handleSelect(e);
      }
      const { clientX, clientY } = e;
      const { left, top } = (e.target as Element).getBoundingClientRect();
      const updatedElm = {
        ...elm,
        isDragging: true,
        origin: {
          x: clientX - left,
          y: clientY - top,
        },
      };

      dispatch(innerElementsEdit(updatedElm));
      dispatch(setActiveElm(updatedElm));
    },
    [elm]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (elm.isDragging) {
        const translation = {
          x: clientX - elm.origin.x,
          y: clientY - elm.origin.y,
        };

        let updatedElm;

        if (
          midBottomRef.current &&
          midTopRef.current &&
          midLeftRef.current &&
          midRightRef.current
        ) {
          updatedElm = {
            ...elm,
            pointsRef: {
              midBottomRef: midBottomRef.current
                .getBoundingClientRect()
                .toJSON(),
              midTopRef: midTopRef.current.getBoundingClientRect().toJSON(),
              midLeftRef: midLeftRef.current.getBoundingClientRect().toJSON(),
              midRightRef: midRightRef.current.getBoundingClientRect().toJSON(),
            },
            tranlation: {
              ...elm.tranlation,
              ...translation,
            },
          };
        } else {
          updatedElm = {
            ...elm,
            tranlation: {
              ...elm.tranlation,
              ...translation,
            },
          };
        }

        dispatch(innerElementsEdit(updatedElm));
        dispatch(setActiveElm(updatedElm));
      }
    },
    [elm.origin]
  );

  const handleMouseUp = useCallback(() => {
    dispatch(
      innerElementsEdit({
        ...elm,
        isDragging: false,
      })
    );
    dispatch(setActiveElm(null));
  }, [elm]);

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
        styles: {
          ...elm.styles,
          ...obj.styles,
        },
      })
    );
  }, [style]);

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

  return {
    setMidBottomRef,
    setMidLeftRef,
    setMidRightRef,
    setMidTopRef,
    handleMouseDown,
  };
};
