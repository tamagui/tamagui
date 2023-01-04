import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleLeftBold } from '../bold/caret-circle-left-bold'
import { CaretCircleLeftDuotone } from '../duotone/caret-circle-left-duotone'
import { CaretCircleLeftFill } from '../fill/caret-circle-left-fill'
import { CaretCircleLeftLight } from '../light/caret-circle-left-light'
import { CaretCircleLeftRegular } from '../regular/caret-circle-left-regular'
import { CaretCircleLeftThin } from '../thin/caret-circle-left-thin'

const weightMap = {
  regular: CaretCircleLeftRegular,
  bold: CaretCircleLeftBold,
  duotone: CaretCircleLeftDuotone,
  fill: CaretCircleLeftFill,
  light: CaretCircleLeftLight,
  thin: CaretCircleLeftThin,
} as const

export const CaretCircleLeft = (props: IconProps) => {
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
