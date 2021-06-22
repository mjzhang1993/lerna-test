import * as React from 'react';
import camelCase from 'lodash/camelCase';
import { TMDXHub } from '~docs/MdxHub';
import Layout from './views/Layout';
import MdxPage from './views/Mdxpage';

interface Props {
  mdxHub: TMDXHub[];
  comName: string;
}

const Components: React.FC<Props> = (props: Props) => {
  const { mdxHub, comName } = props;
  let hub = mdxHub[0];

  if (comName) {
    hub = mdxHub.find((h) => camelCase(h.tagName) === comName) || hub;
  }
  const MdxCom = hub.mdx;

  return (
    <Layout mdxHub={mdxHub} comName={comName}>
      <MdxPage mdxHub={hub}>
        {MdxCom ? <MdxCom /> : null}
      </MdxPage>
    </Layout>
  );
};

export default Components;
