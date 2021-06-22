/**
 * 顶部导航
 * */
import get from 'lodash/get';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { match } from 'path-to-regexp';
import joinAssetPath from '../../../lib/joinAssetPath';
import HeaderLess from './header.module.less';

interface HeaderProps {
  transparent?: boolean;
  menus: { label: string; link: string }[];
  className?: string;
}

export const defaultMenus = [
  { link: '/components', label: '组件' },
  { link: '/about', label: '关于我们' },
];

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { transparent, menus, className } = props;
  const containerClass = [HeaderLess.headerContainer];
  if (transparent) containerClass.push(HeaderLess.transparent);
  if (className) containerClass.push(className);
  const router = useRouter();

  const matchFn = match('/:page+', { decode: decodeURIComponent });
  const result = matchFn(router.asPath);
  const activePage = get(result, 'params.page[0]');
  return (
    <header className={containerClass.join(' ')}>
      <Link href="/">
        <a className={HeaderLess.img}>
          <img src={joinAssetPath('/avatar.png')} alt="logo"/>
        </a>
      </Link>
      <ul className={HeaderLess.menu}>
        {menus.map((menu) => {
          const current = matchFn(menu.link);
          const currentPage = get(current, 'params.page[0]');
          const isActive = activePage === currentPage && activePage !== undefined;
          return (
            <li key={menu.link} className={isActive ? HeaderLess.active : ''}>
              <Link href={menu.link}>{menu.label}</Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
};

export default Header;
