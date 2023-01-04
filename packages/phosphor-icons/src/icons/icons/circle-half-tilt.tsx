import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleHalfTiltBold } from '../bold/circle-half-tilt-bold'
import { CircleHalfTiltDuotone } from '../duotone/circle-half-tilt-duotone'
import { CircleHalfTiltFill } from '../fill/circle-half-tilt-fill'
import { CircleHalfTiltLight } from '../light/circle-half-tilt-light'
import { CircleHalfTiltRegular } from '../regular/circle-half-tilt-regular'
import { CircleHalfTiltThin } from '../thin/circle-half-tilt-thin'

const weightMap = {
  regular: CircleHalfTiltRegular,
  bold: CircleHalfTiltBold,
  duotone: CircleHalfTiltDuotone,
  fill: CircleHalfTiltFill,
  light: CircleHalfTiltLight,
  thin: CircleHalfTiltThin,
} as const

export const CircleHalfTilt = (props: IconProps) => {
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
