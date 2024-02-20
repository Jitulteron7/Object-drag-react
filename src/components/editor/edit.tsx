import React, { useEffect } from 'react';
import DragWrapper from '../drag-wrapper';
import Circle from '../tools/circle';
import ResizeWrapper from '../resize-wrapper';
import { useDispatch, useSelector } from 'react-redux';
import {
  EditorInnerElement,
  addElementInEditor,
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
    dispatch(isSelectedWrapper(false));
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
      isSelected: false,
      isResize: false,
      isDragging: false,
      dir: -1,
    },
    {
      id: 'circle',
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

  return (
    <div
      className="text-black bg-red-500 w-[100vw] h-[100vh]"
      onClick={handleEditorClick}>
      {/* <ResizeWrapper>
        <DragWrapper>
          <Circle />
        </DragWrapper>
      </ResizeWrapper> */}
      {innerElements.map((elm) =>
        elm.id === 'circle' ? (
          <ResizeWrapper elm={elm}>
            <DragWrapper elm={elm}>
              <Circle />
            </DragWrapper>
          </ResizeWrapper>
        ) : (
          <ResizeWrapper elm={elm}>
            <DragWrapper elm={elm}>
              <Square />
            </DragWrapper>
          </ResizeWrapper>
        )
      )}
    </div>
  );
};

export default Editor;
