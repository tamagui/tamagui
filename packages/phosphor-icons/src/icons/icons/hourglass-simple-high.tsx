import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassSimpleHighBold } from '../bold/hourglass-simple-high-bold'
import { HourglassSimpleHighDuotone } from '../duotone/hourglass-simple-high-duotone'
import { HourglassSimpleHighFill } from '../fill/hourglass-simple-high-fill'
import { HourglassSimpleHighLight } from '../light/hourglass-simple-high-light'
import { HourglassSimpleHighRegular } from '../regular/hourglass-simple-high-regular'
import { HourglassSimpleHighThin } from '../thin/hourglass-simple-high-thin'

const weightMap = {
  regular: HourglassSimpleHighRegular,
  bold: HourglassSimpleHighBold,
  duotone: HourglassSimpleHighDuotone,
  fill: HourglassSimpleHighFill,
  light: HourglassSimpleHighLight,
  thin: HourglassSimpleHighThin,
} as const

export const HourglassSimpleHigh = (props: IconProps) => {
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
