import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = {};

const Circle = (props: Props) => {
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
