import * as React from 'react';
import { IBaseIconTypes } from '../Types'

interface IProps {
  component?: any,
  viewBox?: string,
  fill?: string;
}

class BaseIcon extends React.PureComponent<IProps> {
  render(): React.ReactNode {
    const {
      children,
      component: Component = 'svg',
      viewBox = "0 0 1024 1024",
      fill,
      ...others
    } = this.props;
    return (<Component width="1em" height="1em" fill={fill || "currentColor"} viewBox={viewBox} {...others}>
      {children}
    </Component>);
  }
}

export default BaseIcon;