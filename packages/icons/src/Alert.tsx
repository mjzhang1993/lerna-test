import * as React from 'react';
import BaseIcon from "./components/BaseIcon";
import AlertSvg from "./svg/Alert";
import { IBaseIconTypes } from './Types'

interface IProps extends IBaseIconTypes {
  color?: string;
}

class Alert extends React.PureComponent<IProps> {
  render(): React.ReactNode {
    const { color, ...others } = this.props;
    return (
      <BaseIcon component={AlertSvg} fill={color} {...others} />
    );
  }
}

export default Alert;