import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleLeftBold } from '../bold/arrow-circle-left-bold'
import { ArrowCircleLeftDuotone } from '../duotone/arrow-circle-left-duotone'
import { ArrowCircleLeftFill } from '../fill/arrow-circle-left-fill'
import { ArrowCircleLeftLight } from '../light/arrow-circle-left-light'
import { ArrowCircleLeftRegular } from '../regular/arrow-circle-left-regular'
import { ArrowCircleLeftThin } from '../thin/arrow-circle-left-thin'

const weightMap = {
  regular: ArrowCircleLeftRegular,
  bold: ArrowCircleLeftBold,
  duotone: ArrowCircleLeftDuotone,
  fill: ArrowCircleLeftFill,
  light: ArrowCircleLeftLight,
  thin: ArrowCircleLeftThin,
} as const

export const ArrowCircleLeft = (props: IconProps) => {
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
