import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleDoubleUpBold } from '../bold/caret-circle-double-up-bold'
import { CaretCircleDoubleUpDuotone } from '../duotone/caret-circle-double-up-duotone'
import { CaretCircleDoubleUpFill } from '../fill/caret-circle-double-up-fill'
import { CaretCircleDoubleUpLight } from '../light/caret-circle-double-up-light'
import { CaretCircleDoubleUpRegular } from '../regular/caret-circle-double-up-regular'
import { CaretCircleDoubleUpThin } from '../thin/caret-circle-double-up-thin'

const weightMap = {
  regular: CaretCircleDoubleUpRegular,
  bold: CaretCircleDoubleUpBold,
  duotone: CaretCircleDoubleUpDuotone,
  fill: CaretCircleDoubleUpFill,
  light: CaretCircleDoubleUpLight,
  thin: CaretCircleDoubleUpThin,
} as const

export const CaretCircleDoubleUp = (props: IconProps) => {
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
