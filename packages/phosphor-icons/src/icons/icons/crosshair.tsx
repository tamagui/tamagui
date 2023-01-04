import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CrosshairBold } from '../bold/crosshair-bold'
import { CrosshairDuotone } from '../duotone/crosshair-duotone'
import { CrosshairFill } from '../fill/crosshair-fill'
import { CrosshairLight } from '../light/crosshair-light'
import { CrosshairRegular } from '../regular/crosshair-regular'
import { CrosshairThin } from '../thin/crosshair-thin'

const weightMap = {
  regular: CrosshairRegular,
  bold: CrosshairBold,
  duotone: CrosshairDuotone,
  fill: CrosshairFill,
  light: CrosshairLight,
  thin: CrosshairThin,
} as const

export const Crosshair = (props: IconProps) => {
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
