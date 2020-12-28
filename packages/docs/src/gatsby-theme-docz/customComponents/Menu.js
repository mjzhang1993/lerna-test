import * as React from 'react'
import { useMenus, Link } from 'docz'

export const Menu = ({menus: prevMenus}) => {
  const menus = useMenus()
  const sortMenus = (prevMenus || menus).sort((a, b) => (a.weight || 0) - (b.weight || 0))

  return (
    <ul>
      {sortMenus.map(menu => {
        if (Array.isArray(menu.menu)) {
          return (
            <li key={menu.id}>
              <Menu menus={menu.menu}/>
            </li>
          )
        }
        return (
          <li key={menu.id}>
            <Link to={menu.route}>{menu.name}</Link>
          </li>
        )
      })}
    </ul>
  )
}