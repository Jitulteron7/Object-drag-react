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
      <div
        className="bg-blue-500 h-[100px] w-[100px] absolute right-0"
        onMouseUp={() => {
          console.log('mouse up');
        }}
        onMouseDown={() => {
          console.log('mouse down');
        }}>
        {' '}
        asdas
      </div>
    </div>
  );
};

export default Editor;
