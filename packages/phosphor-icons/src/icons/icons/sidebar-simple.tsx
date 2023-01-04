import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SidebarSimpleBold } from '../bold/sidebar-simple-bold'
import { SidebarSimpleDuotone } from '../duotone/sidebar-simple-duotone'
import { SidebarSimpleFill } from '../fill/sidebar-simple-fill'
import { SidebarSimpleLight } from '../light/sidebar-simple-light'
import { SidebarSimpleRegular } from '../regular/sidebar-simple-regular'
import { SidebarSimpleThin } from '../thin/sidebar-simple-thin'

const weightMap = {
  regular: SidebarSimpleRegular,
  bold: SidebarSimpleBold,
  duotone: SidebarSimpleDuotone,
  fill: SidebarSimpleFill,
  light: SidebarSimpleLight,
  thin: SidebarSimpleThin,
} as const

export const SidebarSimple = (props: IconProps) => {
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
