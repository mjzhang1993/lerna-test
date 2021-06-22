/**
 * 组件 MDX 文件路由及 Title 配置
 * */
import React from 'react';
import camelCase from 'lodash/camelCase';
import ButtonMdx from './core/Button/index.mdx';
import AlertMdx from './core/Alert/index.mdx';
import IconsMdx from './icons/index.mdx';

export type TMDXHub = {
  /** 标签名 */
  tagName: string;
  /** 中文名 */
  name: string;
  /** 描述 */
  description: React.ReactNode;
  /** 路由地址，默认 /components/{tagName.toLowerCase()} */
  path: string;
  /** mdx 组件 */
  mdx?: null | ((props: any) => JSX.Element);
};

type PickRequired<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] };

const MdxHub: PickRequired<TMDXHub, 'path'>[] = [
  {
    tagName: 'Button',
    name: '按钮',
    description: '',
    mdx: ButtonMdx
  },
  {
    tagName: 'Alert',
    name: '按钮',
    description: '',
    mdx: AlertMdx
  },
  {
    tagName: 'Icons',
    name: '图标',
    description: '',
    mdx: IconsMdx
  },
];

const injectPath = (mdxHub: PickRequired<TMDXHub, 'path'>[]): TMDXHub[] => {
  return mdxHub.map((hub) => {
    const { tagName, path: hubPath } = hub;
    const path = hubPath || `/components/${camelCase(tagName)}`;
    return { ...hub, path };
  });
};

export default injectPath(MdxHub);
