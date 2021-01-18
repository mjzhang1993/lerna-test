/*
  实际的组件实现
*/
import * as React from 'react';
import './Alert.less';

interface IAlertProps {
  /** 允许覆盖样式 */
  className?: string;
  /** 可以传入 children */
  children?: React.ReactChildren;
  /** 组件类型 */
  type?: 'primary' | 'error' | 'default';
  /** 测试label */
  label?: React.ReactNode;
}

const Alert: React.FC<IAlertProps> = (props: IAlertProps) => {
  const { type, className, label, children } = props;
  let color = '#333333';
  if (type === 'primary') {
    color = '#5352ED';
  } else if (type === 'error') {
    color = '#FF4757';
  }
  return (
    <div className={`${className} alert`} style={{ backgroundColor: color }}>
      {label}--
      {children}--
      {process.env.NODE_ENV}-- BABEL_ENV: {process.env.BABEL_ENV}
    </div>
  );
};

export default Alert;
