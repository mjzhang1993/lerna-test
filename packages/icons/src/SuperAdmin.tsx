
import * as React from 'react';
import BaseIcon from "./components/BaseIcon";
import SuperAdminSvg from "./svg/SuperAdmin";
import { IBaseIconTypes } from './Types'

interface IProps extends IBaseIconTypes {
  color?: string;
}

class SuperAdmin extends React.PureComponent<IProps> {
  
  render(): React.ReactNode {
    const { color, ...others } = this.props;
    return (
      <BaseIcon component={SuperAdminSvg} fill={color} {...others} />
    );
  }
}

export default SuperAdmin;
