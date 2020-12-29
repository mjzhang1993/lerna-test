/**
 * 模拟自定义布局组件
 */
import * as React from 'react'

// const componentsMap = {
//   page: components.Page,
//   notFound: components.NotFound,
//   render: components.Render,
//   h1: components.H1,
//   h2: components.H2,
//   h3: components.H3,
//   h4: components.H4,
//   h5: components.H5,
//   h6: components.H6,
//   ul: components.List,
//   loading: components.Loading,
//   table: components.Table,
//   pre: components.Pre,
//   inlineCode: components.Code,
//   code: Code,
//   playground: Playground,
//   layout: Layout,
//   props: Props,
// }

/**
 * sx 是 theme-ui 的语法，用来做 theme 切换的
 * */ 
const H1 = (props) => (
  <h1 style={{backgroundColor: 'yellow'}}>
    <a
      href={`#${props.id}`}
      sx={{
        color: "inherit",
        textDecoration: "none",
        ":hover": {
          textDecoration: "underline",
        },
      }}
    >
      {props.children}
    </a>
  </h1>
);

const Page = (props) => {
  console.log(props);
  return (
    <div>{props.children}</div>
  )
}

const Loading = (props) => {
  console.log(props);
  return (
    <div>...</div>
  )
}

export default {
  h1: H1,
  page: Page,
  loading: Loading
}