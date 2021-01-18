/**
 * webpack 配置文件
 * */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const autoprefixer = require('autoprefixer');

const BABEL_ENV = process.env.BABEL_ENV || 'umd';
const globals = { React: 'react', ReactDOM: 'react-dom' };
const externalPkg = [/^react\/.+$/, /^react-dom\/.+$/, /^lodash\/.+$/];
BABEL_ENV !== 'umd' && externalPkg.push(/^@babel\/runtime\/.+$/);
const rootDir = path.resolve(__dirname, './');
const sourceDir = path.join(rootDir, 'src');
const entryFile = path.join(rootDir, 'src/index.ts');
const componentDir = 'src/components';
const cModuleNames = fs.readdirSync(path.resolve(componentDir));
const entryFilesPaths = [];
const componentEntryFiles = cModuleNames.reduce((prev, name) => {
  if (!/^[A-Z]\w*/.test(name)) return prev;
  const p = path.join(rootDir, `${componentDir}/${name}`);
  entryFilesPaths.push(p);
  return { ...prev, [name]: `${p}/index` };
}, {});

const commonConfig = {
  mode: process.env.NODE_ENV || 'development',
  externals: externalPkg,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: sourceDir,
        loader: 'babel-loader',
        options: {
          exclude: [
            /node_modules[\\/]core-js/,
            /node_modules[\\/]webpack[\\/]buildin/,
          ], 
        }
      },
      {
        test: /\.less$/,
        include: sourceDir,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: [autoprefixer({ env: BABEL_ENV })] } },
          },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/inline', // 使用webpack 5 内置 loader
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.ts', '.tsx'],
      fix: true,
    }),
    new webpack.ProvidePlugin(globals),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.BABEL_ENV': JSON.stringify(BABEL_ENV || 'umd'),
    }),
  ],
}

const umdConfig = {
  entry: entryFile,
  output: {
    path: path.resolve(__dirname, 'dist/umd/'),
    globalObject: 'this', // 使得在 web node 都可用
    umdNamedDefine: true, // 给生成的 umd 模块中的 amd 部分命名
    library: {
      type: 'umd',
      name: 'WebpackUI',
      auxiliaryComment: '这里是插入的注释kl',
    },
  },
};

const esmConfig = {
  entry: {
    index: {import: entryFile, filename: 'index.js'},
    ...componentEntryFiles
  },
  externals: [
    ...externalPkg,
    ({context, request}, callback) => {
      // 避免模块重复打包
      entryFilesPaths.includes(path.resolve(context, request))
        ? callback(null, request) : callback();
    },
  ],
  output: {
    filename: 'components/[name]/index.js',
    library: {
      type: 'commonjs2',
      auxiliaryComment: '这里是插入的注释kl',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'components/[name]/style/index.css'}),
  ]
};

module.exports = () => {
  switch (BABEL_ENV) {
    case 'umd': 
      return [
        merge(commonConfig, umdConfig, {
          output: {filename: 'webpack-ui.development.js'},
          optimization: { minimize: false },
          plugins: [
            new MiniCssExtractPlugin({ filename: 'webpack-ui.development.css' }),
          ]
        }),
        merge(commonConfig, umdConfig, {
          output: {filename: 'webpack-ui.production.min.js'},
          optimization: {
            minimize: true,
            minimizer: [
              `...`, // webpack 5 提供用来继承已存在的 minimizer
              new CssMinimizerPlugin(),
            ],
          },
          plugins: [
            new MiniCssExtractPlugin({ filename: 'webpack-ui.production.min.css' }),
          ]
        })
      ];
    case 'cjs':
      return merge(commonConfig, esmConfig, {
        optimization: { minimize: false },
        output: {
          path: path.resolve(__dirname, 'dist/cjs/'),
        }
      });
    case 'esm':
      /**
       * NOTICE: 很遗憾，虽然 webpack 5.x 官网上说输出 esm library 已经支持 https://webpack.js.org/configuration/output/#outputmodule
       * 但是实际上到目前为止(webpack 5.15.0) 都不支持 https://github.com/webpack/webpack/issues/2933
       * 临时方案采用 rollup + babel 来输出 esm module
       * */ 
      return merge(commonConfig, esmConfig, {
        mode: 'development',
        optimization: { minimize: false },
        output: {
          path: path.resolve(__dirname, 'dist/es/'),
        },
        experiments: { outputModule: true }
      })
    default:
      return {};
  }
}
