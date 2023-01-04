import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassSimpleLowBold } from '../bold/hourglass-simple-low-bold'
import { HourglassSimpleLowDuotone } from '../duotone/hourglass-simple-low-duotone'
import { HourglassSimpleLowFill } from '../fill/hourglass-simple-low-fill'
import { HourglassSimpleLowLight } from '../light/hourglass-simple-low-light'
import { HourglassSimpleLowRegular } from '../regular/hourglass-simple-low-regular'
import { HourglassSimpleLowThin } from '../thin/hourglass-simple-low-thin'

const weightMap = {
  regular: HourglassSimpleLowRegular,
  bold: HourglassSimpleLowBold,
  duotone: HourglassSimpleLowDuotone,
  fill: HourglassSimpleLowFill,
  light: HourglassSimpleLowLight,
  thin: HourglassSimpleLowThin,
} as const

export const HourglassSimpleLow = (props: IconProps) => {
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
