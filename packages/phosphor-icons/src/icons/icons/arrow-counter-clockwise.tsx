import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCounterClockwiseBold } from '../bold/arrow-counter-clockwise-bold'
import { ArrowCounterClockwiseDuotone } from '../duotone/arrow-counter-clockwise-duotone'
import { ArrowCounterClockwiseFill } from '../fill/arrow-counter-clockwise-fill'
import { ArrowCounterClockwiseLight } from '../light/arrow-counter-clockwise-light'
import { ArrowCounterClockwiseRegular } from '../regular/arrow-counter-clockwise-regular'
import { ArrowCounterClockwiseThin } from '../thin/arrow-counter-clockwise-thin'

const weightMap = {
  regular: ArrowCounterClockwiseRegular,
  bold: ArrowCounterClockwiseBold,
  duotone: ArrowCounterClockwiseDuotone,
  fill: ArrowCounterClockwiseFill,
  light: ArrowCounterClockwiseLight,
  thin: ArrowCounterClockwiseThin,
} as const

export const ArrowCounterClockwise = (props: IconProps) => {
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
