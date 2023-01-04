import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassSimpleBold } from '../bold/hourglass-simple-bold'
import { HourglassSimpleDuotone } from '../duotone/hourglass-simple-duotone'
import { HourglassSimpleFill } from '../fill/hourglass-simple-fill'
import { HourglassSimpleLight } from '../light/hourglass-simple-light'
import { HourglassSimpleRegular } from '../regular/hourglass-simple-regular'
import { HourglassSimpleThin } from '../thin/hourglass-simple-thin'

const weightMap = {
  regular: HourglassSimpleRegular,
  bold: HourglassSimpleBold,
  duotone: HourglassSimpleDuotone,
  fill: HourglassSimpleFill,
  light: HourglassSimpleLight,
  thin: HourglassSimpleThin,
} as const

export const HourglassSimple = (props: IconProps) => {
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
