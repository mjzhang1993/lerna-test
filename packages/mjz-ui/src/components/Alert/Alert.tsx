/*
  实际的组件实现
*/
import * as React from 'react';

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

const Alert = (props: IAlertProps) => {
  const color = props.type === 'primary' ? '#5352ED' : props.type === 'error' ? '#FF4757' : '#333333'
  return (
    <div
      className={`${props.className} Alert`}
      style={{backgroundColor: color, color: '#fff', padding: 20, textAlign: 'center', borderRadius: 4}}
    >
      {props.label}:
      {props.children}
    </div>
  )
}

export default Alert;