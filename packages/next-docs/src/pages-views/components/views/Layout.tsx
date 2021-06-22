/**
 * 布局
 * */

import React from 'react';
import { TMDXHub } from '~docs/MdxHub';
import Header, { defaultMenus } from '../../compositions/Header';
import SideBar from './SideBar';
import LayoutLess from '../styles/layout.module.less';

interface LayoutProps {
  children: React.ReactNode;
  mdxHub: TMDXHub[];
  comName: string;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const { children, mdxHub, comName } = props;

  return (
    <div className={LayoutLess.layoutContainer}>
      <Header menus={defaultMenus} className={LayoutLess.header} />
      <main className={LayoutLess.main}>
        <aside className={LayoutLess.sidebar}>
          <SideBar mdxHub={mdxHub} activeComName={comName} />
        </aside>
        <div className={LayoutLess.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
