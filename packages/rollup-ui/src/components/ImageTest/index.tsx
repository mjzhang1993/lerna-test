/*
  实际的组件实现
*/
import * as React from 'react';
import AvatarImg from './avatar.png';

const ImageTest: React.FC = () => {
  return <img src={AvatarImg} alt="" />;
};

export default ImageTest;
