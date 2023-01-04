import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClockClockwiseBold } from '../bold/clock-clockwise-bold'
import { ClockClockwiseDuotone } from '../duotone/clock-clockwise-duotone'
import { ClockClockwiseFill } from '../fill/clock-clockwise-fill'
import { ClockClockwiseLight } from '../light/clock-clockwise-light'
import { ClockClockwiseRegular } from '../regular/clock-clockwise-regular'
import { ClockClockwiseThin } from '../thin/clock-clockwise-thin'

const weightMap = {
  regular: ClockClockwiseRegular,
  bold: ClockClockwiseBold,
  duotone: ClockClockwiseDuotone,
  fill: ClockClockwiseFill,
  light: ClockClockwiseLight,
  thin: ClockClockwiseThin,
} as const

export const ClockClockwise = (props: IconProps) => {
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
