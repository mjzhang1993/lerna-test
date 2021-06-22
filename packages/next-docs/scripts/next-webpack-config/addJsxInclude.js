const path = require('path');
const cloneDeep = require('lodash/cloneDeep');

const addJsxInclude = (config, defaultLoaders) => {
  const jsxRuleIdx = config.module.rules.findIndex((rule) => rule.test instanceof RegExp && rule.test.test('xxx.tsx'));
  const jsxRule = config.module.rules[jsxRuleIdx];
  const rule = cloneDeep(jsxRule);

  rule.test = /\.(tsx|ts)$/;
  rule.include = [
    path.resolve(__dirname, '../../../next-docs/docs'),
    path.resolve(__dirname, '../../../mjz-ui'),
    path.resolve(__dirname, '../../../icons')
  ];

  rule.use = [
    defaultLoaders.babel,
    {
      loader: 'react-docgen-typescript-loader',
      options: {
        tsconfigPath: path.resolve(__dirname, "../../tsconfig.json"),
        shouldExtractLiteralValuesFromEnum: true,
        propFilter: (prop) => {
          // HTML 原生标签属性都是从 @types/react 继承出来的, 通过以下操作排除打包
          if (prop.declarations !== undefined && prop.declarations.length > 0) {
            const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
              return !declaration.fileName.includes("node_modules");
            });
            return Boolean(hasPropAdditionalDescription);
          }

          return true;
        }
      }
    }
  ]
  config.module.rules.splice(jsxRuleIdx, 0, rule);

  return config;
}

module.exports = addJsxInclude;
