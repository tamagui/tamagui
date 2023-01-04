import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassHighBold } from '../bold/hourglass-high-bold'
import { HourglassHighDuotone } from '../duotone/hourglass-high-duotone'
import { HourglassHighFill } from '../fill/hourglass-high-fill'
import { HourglassHighLight } from '../light/hourglass-high-light'
import { HourglassHighRegular } from '../regular/hourglass-high-regular'
import { HourglassHighThin } from '../thin/hourglass-high-thin'

const weightMap = {
  regular: HourglassHighRegular,
  bold: HourglassHighBold,
  duotone: HourglassHighDuotone,
  fill: HourglassHighFill,
  light: HourglassHighLight,
  thin: HourglassHighThin,
} as const

export const HourglassHigh = (props: IconProps) => {
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
