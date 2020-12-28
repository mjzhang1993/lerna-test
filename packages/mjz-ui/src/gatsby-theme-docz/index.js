/**
 * 自定义主题
*/
import React from 'react'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { ThemeProvider } from 'theme-ui'
import baseComponents from 'gatsby-theme-docz/src/components'
import baseTheme from 'gatsby-theme-docz/src/theme'
// import customComponents from './components/index'
// import {Menu} from './customComponents/Menu';

/**
 * markdow => html 的映射组件
 * 在这里仿照 gatsby-theme-docz 开发我们自己的替代组件
 * */ 
const componentsMap = {
  ...baseComponents,
  // ...customComponents,
  /* your custom components */
}

const Theme = ({ children }) => {
  const config = useConfig();
  /**
   * ThemeProvider 是 theme-ui 的包装组件
   * docz 同样使用的 theme-ui 做样式展示
   * */ 
  return (
    <ThemeProvider theme={config.themeConfig}>
      {/* <Menu/> */}
      <ComponentsProvider components={componentsMap}>
        {children}
      </ComponentsProvider>
    </ThemeProvider>
  )
}

/**
 * baseTheme: theme-ui 需要传入的样式配置，也可以在 doczrc.js 中配置 themeConfig
 * 我们这里使用的时 gatsby-theme-docz 默认的 theme 配置，也可以仿照它写一个新的
 */
export default theme(baseTheme)(Theme)