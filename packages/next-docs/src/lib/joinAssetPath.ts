/**
 * 因为 'next/image' 不支持 next export 输出的 SSG
 * 配置文件中的 basePath 不能作用到静态资源，assetPrefix 配置不再被支持使用
 * 因此创建一个变量 assetPath 然后通过如下方法拼接资源
 * */

const joinAssetPath = (path: string) => {
  const assetPath = process.env.ASSET_PATH;

  return `${assetPath}/${path}`.replace(/\/+/g, '/');
};

export default joinAssetPath;
