import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleHalfBold } from '../bold/circle-half-bold'
import { CircleHalfDuotone } from '../duotone/circle-half-duotone'
import { CircleHalfFill } from '../fill/circle-half-fill'
import { CircleHalfLight } from '../light/circle-half-light'
import { CircleHalfRegular } from '../regular/circle-half-regular'
import { CircleHalfThin } from '../thin/circle-half-thin'

const weightMap = {
  regular: CircleHalfRegular,
  bold: CircleHalfBold,
  duotone: CircleHalfDuotone,
  fill: CircleHalfFill,
  light: CircleHalfLight,
  thin: CircleHalfThin,
} as const

export const CircleHalf = (props: IconProps) => {
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
