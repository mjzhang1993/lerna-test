
import * as React from 'react';
import BaseIcon from "./components/BaseIcon";
import StackSvg from "./svg/Stack";
import { IBaseIconTypes } from './Types'

interface IProps extends IBaseIconTypes {
  color?: string;
}

class Stack extends React.PureComponent<IProps> {
  
  render(): React.ReactNode {
    const { color, ...others } = this.props;
    return (
      <BaseIcon component={StackSvg} fill={color} {...others} />
    );
  }
}

export default Stack;
