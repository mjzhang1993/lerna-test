import path from 'path';
import * as React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import MdxHub from '~docs/MdxHub';
import ComponentsUI from '../../pages-views/components';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { comName: string } }[] = [];

  MdxHub.forEach((hub) => {
    if (!hub.path) return;
    const result = path.parse(hub.path || '');
    if (hub.mdx) paths.push({ params: { comName: result.name } });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const comName = params?.comName || '';

  return {props: {comName}};
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Components: React.FC<Props> = (props: Props) => {
  const { comName } = props;

  return <ComponentsUI mdxHub={MdxHub} comName={comName} />;
};

export default Components;
