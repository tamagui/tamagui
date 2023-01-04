import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsClockwiseBold } from '../bold/arrows-clockwise-bold'
import { ArrowsClockwiseDuotone } from '../duotone/arrows-clockwise-duotone'
import { ArrowsClockwiseFill } from '../fill/arrows-clockwise-fill'
import { ArrowsClockwiseLight } from '../light/arrows-clockwise-light'
import { ArrowsClockwiseRegular } from '../regular/arrows-clockwise-regular'
import { ArrowsClockwiseThin } from '../thin/arrows-clockwise-thin'

const weightMap = {
  regular: ArrowsClockwiseRegular,
  bold: ArrowsClockwiseBold,
  duotone: ArrowsClockwiseDuotone,
  fill: ArrowsClockwiseFill,
  light: ArrowsClockwiseLight,
  thin: ArrowsClockwiseThin,
} as const

export const ArrowsClockwise = (props: IconProps) => {
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
