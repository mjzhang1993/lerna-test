import Head from 'next/head';
import React from 'react';
import Link from 'next/link';
import { TMDXHub } from '~docs/MdxHub';
import MdxPageLess from '../styles/mdxPage.module.less';

interface MdxPageProps {
  children: React.ReactNode;
  mdxHub: TMDXHub;
}

const MdxPage: React.FC<MdxPageProps> = (props: MdxPageProps) => {
  const { children, mdxHub } = props;
  const { tagName, name, description } = mdxHub;
  return (
    <div className={MdxPageLess.container}>
      <Head>
        <title>{tagName}</title>
      </Head>
      <header className={`${MdxPageLess.centerContent} ${MdxPageLess.header}`}>
        <h1>
          <span>{tagName}</span>
          <span>{name}</span>
        </h1>
        <p>{description}</p>
      </header>
      <div className={MdxPageLess.centerContent}>{children}</div>
    </div>
  );
};

export default React.memo(MdxPage);
