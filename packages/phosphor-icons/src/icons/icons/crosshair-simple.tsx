import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CrosshairSimpleBold } from '../bold/crosshair-simple-bold'
import { CrosshairSimpleDuotone } from '../duotone/crosshair-simple-duotone'
import { CrosshairSimpleFill } from '../fill/crosshair-simple-fill'
import { CrosshairSimpleLight } from '../light/crosshair-simple-light'
import { CrosshairSimpleRegular } from '../regular/crosshair-simple-regular'
import { CrosshairSimpleThin } from '../thin/crosshair-simple-thin'

const weightMap = {
  regular: CrosshairSimpleRegular,
  bold: CrosshairSimpleBold,
  duotone: CrosshairSimpleDuotone,
  fill: CrosshairSimpleFill,
  light: CrosshairSimpleLight,
  thin: CrosshairSimpleThin,
} as const

export const CrosshairSimple = (props: IconProps) => {
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
