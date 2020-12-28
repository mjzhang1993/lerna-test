const path = require("path");

// 定制化 Webpack 配置
exports.onCreateWebpackConfig = (args) => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../src/components/"),
      },
    },
  });
};

exports.onCreateDevServer = ({ app }) => {
  app.get('/hello', function (req, res) {
    res.send('hello world')
  })
}