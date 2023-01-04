import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClockCounterClockwiseBold } from '../bold/clock-counter-clockwise-bold'
import { ClockCounterClockwiseDuotone } from '../duotone/clock-counter-clockwise-duotone'
import { ClockCounterClockwiseFill } from '../fill/clock-counter-clockwise-fill'
import { ClockCounterClockwiseLight } from '../light/clock-counter-clockwise-light'
import { ClockCounterClockwiseRegular } from '../regular/clock-counter-clockwise-regular'
import { ClockCounterClockwiseThin } from '../thin/clock-counter-clockwise-thin'

const weightMap = {
  regular: ClockCounterClockwiseRegular,
  bold: ClockCounterClockwiseBold,
  duotone: ClockCounterClockwiseDuotone,
  fill: ClockCounterClockwiseFill,
  light: ClockCounterClockwiseLight,
  thin: ClockCounterClockwiseThin,
} as const

export const ClockCounterClockwise = (props: IconProps) => {
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
