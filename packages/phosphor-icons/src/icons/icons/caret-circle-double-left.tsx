import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleDoubleLeftBold } from '../bold/caret-circle-double-left-bold'
import { CaretCircleDoubleLeftDuotone } from '../duotone/caret-circle-double-left-duotone'
import { CaretCircleDoubleLeftFill } from '../fill/caret-circle-double-left-fill'
import { CaretCircleDoubleLeftLight } from '../light/caret-circle-double-left-light'
import { CaretCircleDoubleLeftRegular } from '../regular/caret-circle-double-left-regular'
import { CaretCircleDoubleLeftThin } from '../thin/caret-circle-double-left-thin'

const weightMap = {
  regular: CaretCircleDoubleLeftRegular,
  bold: CaretCircleDoubleLeftBold,
  duotone: CaretCircleDoubleLeftDuotone,
  fill: CaretCircleDoubleLeftFill,
  light: CaretCircleDoubleLeftLight,
  thin: CaretCircleDoubleLeftThin,
} as const

export const CaretCircleDoubleLeft = (props: IconProps) => {
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
