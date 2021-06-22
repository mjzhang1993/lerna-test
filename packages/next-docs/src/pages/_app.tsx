import './globals.less';
import type { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import { Wrapper, Paragraph, headings, UL, OL, Code } from '~controls';

const components = {
  ...headings,
  p: Paragraph,
  ol: OL,
  ul: UL,
  pre: Code,
  wrapper: Wrapper,
};

// 顶级组件，所有 page 之间共享，用于全局样式，全局 state
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <MDXProvider components={components}>
      <main id="document-scroll-container">
        <Component {...pageProps} />
      </main>
    </MDXProvider>
  );
};
export default MyApp;
