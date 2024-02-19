import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Props = {};

const Square = (props: Props) => {
  return (
    <div
      className="bg-green-500 "
      style={{
        width: '100%',
        height: '100%',
      }}></div>
  );
};

export default Square;
