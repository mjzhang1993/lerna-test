
import * as React from 'react';
import BaseIcon from "./components/BaseIcon";
import PiechartSvg from "./svg/Piechart";
import { IBaseIconTypes } from './Types'

interface IProps extends IBaseIconTypes {
  color?: string;
}

class Piechart extends React.PureComponent<IProps> {
  
  render(): React.ReactNode {
    const { color, ...others } = this.props;
    return (
      <BaseIcon component={PiechartSvg} fill={color} {...others} />
    );
  }
}

export default Piechart;
