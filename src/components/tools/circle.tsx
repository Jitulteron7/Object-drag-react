import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = {};

const Circle = (props: Props) => {
  const innerElement = useSelector(
    (state: RootState) => state.editor.value.innerElement
  );
  return (
    <div
      className="bg-blue-500 "
      style={{
        width: '100%',
        height: '100%',
      }}>
      Circle
    </div>
  );
};

export default Circle;
