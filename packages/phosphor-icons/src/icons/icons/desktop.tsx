import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DesktopBold } from '../bold/desktop-bold'
import { DesktopDuotone } from '../duotone/desktop-duotone'
import { DesktopFill } from '../fill/desktop-fill'
import { DesktopLight } from '../light/desktop-light'
import { DesktopRegular } from '../regular/desktop-regular'
import { DesktopThin } from '../thin/desktop-thin'

const weightMap = {
  regular: DesktopRegular,
  bold: DesktopBold,
  duotone: DesktopDuotone,
  fill: DesktopFill,
  light: DesktopLight,
  thin: DesktopThin,
} as const

export const Desktop = (props: IconProps) => {
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
