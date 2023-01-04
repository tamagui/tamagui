import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowCircleDownLeftBold } from '../bold/arrow-circle-down-left-bold'
import { ArrowCircleDownLeftDuotone } from '../duotone/arrow-circle-down-left-duotone'
import { ArrowCircleDownLeftFill } from '../fill/arrow-circle-down-left-fill'
import { ArrowCircleDownLeftLight } from '../light/arrow-circle-down-left-light'
import { ArrowCircleDownLeftRegular } from '../regular/arrow-circle-down-left-regular'
import { ArrowCircleDownLeftThin } from '../thin/arrow-circle-down-left-thin'

const weightMap = {
  regular: ArrowCircleDownLeftRegular,
  bold: ArrowCircleDownLeftBold,
  duotone: ArrowCircleDownLeftDuotone,
  fill: ArrowCircleDownLeftFill,
  light: ArrowCircleDownLeftLight,
  thin: ArrowCircleDownLeftThin,
} as const

export const ArrowCircleDownLeft = (props: IconProps) => {
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
