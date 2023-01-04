import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowClockwiseBold } from '../bold/arrow-clockwise-bold'
import { ArrowClockwiseDuotone } from '../duotone/arrow-clockwise-duotone'
import { ArrowClockwiseFill } from '../fill/arrow-clockwise-fill'
import { ArrowClockwiseLight } from '../light/arrow-clockwise-light'
import { ArrowClockwiseRegular } from '../regular/arrow-clockwise-regular'
import { ArrowClockwiseThin } from '../thin/arrow-clockwise-thin'

const weightMap = {
  regular: ArrowClockwiseRegular,
  bold: ArrowClockwiseBold,
  duotone: ArrowClockwiseDuotone,
  fill: ArrowClockwiseFill,
  light: ArrowClockwiseLight,
  thin: ArrowClockwiseThin,
} as const

export const ArrowClockwise = (props: IconProps) => {
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
