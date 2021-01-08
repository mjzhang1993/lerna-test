
import * as React from 'react';
import BaseIcon from "./components/BaseIcon";
import LightbulbSvg from "./svg/Lightbulb";
import { IBaseIconTypes } from './Types'

interface IProps extends IBaseIconTypes {
  color?: string;
}

class Lightbulb extends React.PureComponent<IProps> {
  
  render(): React.ReactNode {
    const { color, ...others } = this.props;
    return (
      <BaseIcon component={LightbulbSvg} fill={color} {...others} />
    );
  }
}

export default Lightbulb;
