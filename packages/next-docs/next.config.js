const slug = require('remark-slug');
const rehypePlugin = require('./scripts/rehyoe-plugin/rehype');
const injectLessLoader = require('./scripts/next-webpack-config/injectLessLoader');
const injectAlias = require('./scripts/next-webpack-config/injectAlias');
const addJsxInclude = require('./scripts/next-webpack-config/addJsxInclude');

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [slug],
    rehypePlugins: [rehypePlugin]
  }
});

const basePath = process.env.NODE_ENV === 'development' ? '' : '/mjz-ui';

module.exports = withMDX({
  webpack5: true,
  basePath: basePath,
  pageExtensions: ["mdx", "tsx", 'ts', 'js', 'md'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    ASSET_PATH: basePath + '/'
  },
  trailingSlash: true,
  webpack(config, nextConfig) {
    // add less compile
    config = injectLessLoader(config, nextConfig);

    // add alias
    config = injectAlias(config);

    // include docgen rule
    config = addJsxInclude(config, nextConfig.defaultLoaders);

    return config
  },
});
