import { useCallback, useEffect, useRef } from 'react';
import {
  EditorInnerElement,
  innerElementsEdit,
  isSelectedWrapper,
  setActiveElm,
} from '../redux/feature/editor';
import { useDispatch } from 'react-redux';

export const useResizeHook = (elm: EditorInnerElement) => {
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

  const handleWrapperMouseDown = useCallback(
    (e: React.MouseEvent, dir: number) => {
      if (!elm.isSelected) {
        handleSelect(e);
      }

      const updatedElm = {
        ...elm,
        resizeOrg: {
          x: e.clientX,
          y: e.clientY,
        },
        dir: dir,
        isResize: true,
      };
      dispatch(innerElementsEdit(updatedElm));

      dispatch(setActiveElm(updatedElm));
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
            styles: {
              ...elm.styles,
              ...obj.styles,
            },
          };
        } else {
          updatedElm = {
            ...elm,
            styles: {
              ...elm.styles,
              ...obj.styles,
            },
          };
        }
        dispatch(innerElementsEdit(updatedElm));
        dispatch(setActiveElm(updatedElm));
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
    dispatch(setActiveElm(null));
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

  return {
    setMidBottomRef,
    setMidLeftRef,
    setMidRightRef,
    setMidTopRef,
    handleWrapperMouseDown,
    handleSelect,
  };
};
