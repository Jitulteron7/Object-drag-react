import { useEffect, useMemo, useRef } from 'react';
import Circle from '../tools/circle';
import CoreWrapper from '../core-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import {
  EditorInnerElement,
  PointsRef,
  addElementInEditor,
  innerElementsEdit,
  isSelectedWrapper,
} from '../../redux/feature/editor';
import Square from '../tools/square';
import { RootState } from '../../redux/store';

type Props = {};

const Editor = (props: Props) => {
  const innerElements = useSelector(
    (state: RootState) => state.editor.value.innerElements
  );
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    dispatch(isSelectedWrapper(null));
  };

  const shapes: EditorInnerElement[] = [
    {
      id: 'square',
      origin: {
        x: 100,
        y: 100,
      },
      tranlation: {
        x: 100,
        y: 100,
      },
      resizeOrg: {
        x: 100,
        y: 100,
      },
      styles: {
        height: 100,
        width: 100,
        left: 100,
        top: 100,
      },
      pointsRef: {
        midBottomRef: null,
        midTopRef: null,
        midLeftRef: null,
        midRightRef: null,
      },
      isSelected: false,
      isResize: false,
      isDragging: false,
      dir: -1,
    },
    {
      id: 'square1',
      origin: {
        x: 100,
        y: 100,
      },
      tranlation: {
        x: 100,
        y: 100,
      },
      resizeOrg: {
        x: 100,
        y: 100,
      },
      pointsRef: {
        midBottomRef: null,
        midTopRef: null,
        midLeftRef: null,
        midRightRef: null,
      },
      styles: {
        height: 100,
        width: 100,
        left: 100,
        top: 100,
      },
      isSelected: false,
      isResize: false,
      isDragging: false,
      dir: -1,
    },
    {
      id: 'square2',
      origin: {
        x: 100,
        y: 100,
      },
      tranlation: {
        x: 100,
        y: 100,
      },
      resizeOrg: {
        x: 100,
        y: 100,
      },
      pointsRef: {
        midBottomRef: null,
        midTopRef: null,
        midLeftRef: null,
        midRightRef: null,
      },
      styles: {
        height: 100,
        width: 100,
        left: 100,
        top: 100,
      },
      isSelected: false,
      isResize: false,
      isDragging: false,
      dir: -1,
    },
  ];

  useEffect(() => {
    if (innerElements.length === 0) {
      for (let shape of shapes) {
        dispatch(addElementInEditor(shape));
      }
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const midPointRefs: (keyof PointsRef)[] = [
    'midTopRef',
    'midBottomRef',
    'midRightRef',
    'midLeftRef',
  ];

  // get drag and resize

  const elm1 = useMemo(
    () =>
      innerElements.find(
        (innerElm) => innerElm.isDragging || innerElm.isResize
      ),
    [innerElements]
  );

  useEffect(() => {
    console.log(elm1, 'testing');

    // canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = 'red';
    // canvas

    if (innerElements.length === 0) return;

    // get drag and resize

    if (!elm1) return;
    for (let elm2 of innerElements) {
      if (elm2.id === elm1.id) continue;

      // cobmition of all the coordinates
      for (let i = 0; i < midPointRefs.length; i++) {
        const midPointRef = midPointRefs[i];
        if (!midPointRef) return;
        for (let j = 0; j < midPointRefs.length; j++) {
          const midPointRefx = midPointRefs[j];
          let x1 = (elm1.pointsRef?.[midPointRef]?.x ?? 0) + 4;
          let y1 = (elm1?.pointsRef?.[midPointRef]?.y ?? 0) + 4;
          let x2 = (elm2.pointsRef?.[midPointRefx]?.x ?? 0) + 4;
          let y2 = (elm2.pointsRef?.[midPointRefx]?.y ?? 0) + 4;

          //y-axis
          if (y1 === y2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          //x-axis
          if (x1 === x2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          if (y1 !== y2 && x1 !== x2) {
            let left = 0;
            let top = 0;
            const delY = y1 - y2;
            const delX = x1 - x2;
            if (Math.abs(delY) <= 3) {
              //y-axis
              top += delY >= 0 ? -delY : delY;
            }
            if (Math.abs(delX) <= 3) {
              //x-axis
              left += delX >= 0 ? -delX : delX;
            }

            if (elm1?.isResize || elm1?.isSelected) {
              dispatch(
                innerElementsEdit({
                  ...elm1,
                  styles: {
                    ...elm1.styles,
                    left: (elm1.styles.left as number) + left,
                    top: (elm1.styles.top as number) + top,
                  },
                })
              );
            }
          }
        }
      }
      // cobmition of all the coordinates
    }
  }, [elm1?.isResize, elm1?.isSelected]);

  return (
    <div
      className="text-black bg-red-500 w-[100vw] h-[100vh]"
      onClick={handleEditorClick}>
      <canvas ref={canvasRef} className="bg-white" />
      {innerElements.map((elm, idx) =>
        elm.id === 'circle' ? (
          <CoreWrapper key={idx} elm={elm}>
            <Circle />
          </CoreWrapper>
        ) : (
          <CoreWrapper key={idx} elm={elm}>
            <Square />
          </CoreWrapper>
        )
      )}
    </div>
  );
};

export default Editor;
