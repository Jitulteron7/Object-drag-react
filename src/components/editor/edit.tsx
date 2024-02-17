import React from 'react';
import DragWrapper from '../drag-wrapper';
import Circle from '../tools/circle';

type Props = {};

const Editor = (props: Props) => {
  return (
    <div className="text-black bg-red-500 w-[100vw] h-[100vh]">
      <DragWrapper>
        <Circle />
      </DragWrapper>
    </div>
  );
};

export default Editor;
