import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsCounterClockwiseBold } from '../bold/arrows-counter-clockwise-bold'
import { ArrowsCounterClockwiseDuotone } from '../duotone/arrows-counter-clockwise-duotone'
import { ArrowsCounterClockwiseFill } from '../fill/arrows-counter-clockwise-fill'
import { ArrowsCounterClockwiseLight } from '../light/arrows-counter-clockwise-light'
import { ArrowsCounterClockwiseRegular } from '../regular/arrows-counter-clockwise-regular'
import { ArrowsCounterClockwiseThin } from '../thin/arrows-counter-clockwise-thin'

const weightMap = {
  regular: ArrowsCounterClockwiseRegular,
  bold: ArrowsCounterClockwiseBold,
  duotone: ArrowsCounterClockwiseDuotone,
  fill: ArrowsCounterClockwiseFill,
  light: ArrowsCounterClockwiseLight,
  thin: ArrowsCounterClockwiseThin,
} as const

export const ArrowsCounterClockwise = (props: IconProps) => {
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
