import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleDownBold } from '../bold/caret-circle-down-bold'
import { CaretCircleDownDuotone } from '../duotone/caret-circle-down-duotone'
import { CaretCircleDownFill } from '../fill/caret-circle-down-fill'
import { CaretCircleDownLight } from '../light/caret-circle-down-light'
import { CaretCircleDownRegular } from '../regular/caret-circle-down-regular'
import { CaretCircleDownThin } from '../thin/caret-circle-down-thin'

const weightMap = {
  regular: CaretCircleDownRegular,
  bold: CaretCircleDownBold,
  duotone: CaretCircleDownDuotone,
  fill: CaretCircleDownFill,
  light: CaretCircleDownLight,
  thin: CaretCircleDownThin,
} as const

export const CaretCircleDown = (props: IconProps) => {
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
