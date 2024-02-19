import React from 'react';
import DragWrapper from '../drag-wrapper';
import Circle from '../tools/circle';
import ResizeWrapper from '../resize-wrapper';
import { useDispatch } from 'react-redux';
import { isSelectedWrapper } from '../../redux/feature/editor';

type Props = {};

const Editor = (props: Props) => {
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    dispatch(isSelectedWrapper(false));
  };
  return (
    <div
      className="text-black bg-red-500 w-[100vw] h-[100vh]"
      onClick={handleEditorClick}>
      <ResizeWrapper>
        {/* <DragWrapper> */}
        <Circle />
        {/* </DragWrapper> */}
      </ResizeWrapper>
    </div>
  );
};

export default Editor;
