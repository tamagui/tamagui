import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleDoubleDownBold } from '../bold/caret-circle-double-down-bold'
import { CaretCircleDoubleDownDuotone } from '../duotone/caret-circle-double-down-duotone'
import { CaretCircleDoubleDownFill } from '../fill/caret-circle-double-down-fill'
import { CaretCircleDoubleDownLight } from '../light/caret-circle-double-down-light'
import { CaretCircleDoubleDownRegular } from '../regular/caret-circle-double-down-regular'
import { CaretCircleDoubleDownThin } from '../thin/caret-circle-double-down-thin'

const weightMap = {
  regular: CaretCircleDoubleDownRegular,
  bold: CaretCircleDoubleDownBold,
  duotone: CaretCircleDoubleDownDuotone,
  fill: CaretCircleDoubleDownFill,
  light: CaretCircleDoubleDownLight,
  thin: CaretCircleDoubleDownThin,
} as const

export const CaretCircleDoubleDown = (props: IconProps) => {
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
