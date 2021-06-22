const path = require('path');
const fs = require('fs');
const get = require('lodash/get');
const cloneDeep = require('lodash/cloneDeep');

const addLessToRegExp = (rx) =>
  new RegExp(rx.source.replace("|sass", "|sass|less"), rx.flags);

const injectLessLoader = (config, nextConfig) => {
  let sassModuleRule;
  const cssRule = config.module.rules.find((rule) => get(rule, 'oneOf[0].options.__next_css_remove'));

  cssRule.oneOf.forEach((rule) => {
    if (get(rule, 'use.loader') === "error-loader") return;
    if ((get(rule, 'use.loader') || []).includes("file-loader")) {
      rule.issuer = Array.isArray(rule.issuer)
        ? rule.issuer.map(rx => addLessToRegExp(rx))
        : addLessToRegExp(rule.issuer);
    }
    if (get(rule, 'test.source') === "\\.module\\.(scss|sass)$") {
      sassModuleRule = rule;
    }
  });

  let lessRule = cloneDeep(sassModuleRule);
  lessRule.test = /\.less$/;

  // 删除 issuer 对文件目录的限制
  delete lessRule.issuer;

  // 替换 sass-loader 为 less-loader
  lessRule.use.splice(-1, 1, {
    loader: "less-loader",
    options: {
      lessOptions: {
        javascriptEnabled: true,
        globalVars: {
          ASSET_PATH: get(nextConfig, 'config.env.ASSET_PATH') || '/'
        }
      }
    },
  });

  // 重要：将 sideEffects 设置为 true 否则非 css-module 不会被打包
  lessRule.sideEffects = true;

  // 更改 css-loader 的配置
  const cssLoaderInLessModuleIndex = lessRule.use.findIndex((item) =>
    `${item.loader}`.includes('css-loader'),
  );
  const cssLoaderInLessModule = lessRule.use.find((item) =>
    `${item.loader}`.includes('css-loader'),
  );

  // clone
  const cssLoaderClone = cloneDeep(cssLoaderInLessModule);

  // 去除 getLocalIdent，改为使用 localIdentName
  if (get(cssLoaderClone, 'options.modules.getLocalIdent')) {
    delete cssLoaderClone.options.modules.getLocalIdent;
  }

  // 更新 css-loader 主要更新 modules 配置
  cssLoaderClone.options = {
    ...cssLoaderClone.options,
    sourceMap: Boolean(nextConfig.dev),
    modules: {
      localIdentName: '[local]--[hash:4]',
      ...cssLoaderClone.options.modules,
      mode: 'local',
      auto: true, // 自动识别是不是 css-module
    }
  }

  lessRule.use.splice(cssLoaderInLessModuleIndex, 1, cssLoaderClone);
  cssRule.oneOf.splice(cssRule.oneOf.indexOf(sassModuleRule), 0, lessRule);

  return config;
}

module.exports = injectLessLoader;
