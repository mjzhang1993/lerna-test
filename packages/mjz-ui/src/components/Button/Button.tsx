/*
  实际的组件实现
*/
import * as React from 'react';
import './Button.less';

interface IButtonProps {
  /** 允许覆盖样式 */
  className?: string;
  /** 可以传入 children */
  children?: React.ReactChildren;
  /** 组件类型 */
  type?: 'primary' | 'error' | 'default';
  /** 组件大小 */
  size?: 'large' | 'small' | 'default';
  /** 
   * 单击事件
   */
  onClick?: () => void;
}

const Button = (props: IButtonProps) => {
  const color = props.type === 'primary' ? '#5352ED' : props.type === 'error' ? '#FF4757' : '#333333'
  const height = props.size === 'large' ? 40 : props.size === 'small' ? 24 : 32;
  /** 组件底层由原生 button 组件实现 */ 
  return (
    <button
      className={`${props.className} button`}
      style={{
        borderColor: color,
        color,
        height
      }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
Button.defaultProps = {
  type: 'primary',
  size: 'default'
}

export default Button;