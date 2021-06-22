const path = require('path');

const injectAlias = (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '~controls': path.resolve(__dirname, './src/controls'),
    '~docs': path.resolve(__dirname, './docs'),
    "@mjz-test/mjz-ui": path.resolve(__dirname, "../../../mjz-ui/src"),
    "@mjz-test/icons": path.resolve(__dirname, "../../../icons/src"),
  }

  return config;
}

module.exports = injectAlias;
