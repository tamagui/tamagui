import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SidebarBold } from '../bold/sidebar-bold'
import { SidebarDuotone } from '../duotone/sidebar-duotone'
import { SidebarFill } from '../fill/sidebar-fill'
import { SidebarLight } from '../light/sidebar-light'
import { SidebarRegular } from '../regular/sidebar-regular'
import { SidebarThin } from '../thin/sidebar-thin'

const weightMap = {
  regular: SidebarRegular,
  bold: SidebarBold,
  duotone: SidebarDuotone,
  fill: SidebarFill,
  light: SidebarLight,
  thin: SidebarThin,
} as const

export const Sidebar = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
