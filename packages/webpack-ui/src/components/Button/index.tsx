/*
  组件的入口，负责最终输出内容的整合
  具体实现组件代码在与目录同名的组件内实现
*/
import Button from './Button';

export type { IButtonProps } from './Button';

export { default as NoteButton } from './NoteButton';

export default Button;

console.log('has logsss');
