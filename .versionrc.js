module.exports = {
  header: "some", // 配置 changelog 顶部显示文案
  types: [
    {
      type: "feat",
      section: "Features",
    },
    {
      type: "fix",
      section: "Bug Fixes",
    },
    {
      type: "docs", // 新增 docs 的 changelog 支持
      section: "Docs", // section 配置的时显示的标题
    },
  ],
};