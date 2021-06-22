import React from 'react';
import camelCase from 'lodash/camelCase';
import Link from 'next/link';
import { TMDXHub } from '~docs/MdxHub';
import SidebarLess from '../styles/sideBar.module.less';

interface SideBarProps {
  mdxHub: TMDXHub[];
  activeComName: string;
}

class SideBar extends React.PureComponent<SideBarProps> {
  render(): React.ReactNode {
    const { mdxHub, activeComName } = this.props;

    return (
      <div className={SidebarLess.menus}>
        {mdxHub.map((hub) => {
          const { tagName, name, path } = hub;
          const linkClass = [
            SidebarLess.menuItem,
            activeComName === camelCase(tagName) ? SidebarLess.active : '',
          ];
          return (
            <Link key={path} href={path}>
              <a className={linkClass.join(' ')}>
                <span>{tagName}</span>
                <span>{name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default SideBar;
