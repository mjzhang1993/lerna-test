// babel 配置文件
module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: 'current',
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
        loose: true,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ];
  return { presets };
};
