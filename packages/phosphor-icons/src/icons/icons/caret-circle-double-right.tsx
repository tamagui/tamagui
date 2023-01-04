import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleDoubleRightBold } from '../bold/caret-circle-double-right-bold'
import { CaretCircleDoubleRightDuotone } from '../duotone/caret-circle-double-right-duotone'
import { CaretCircleDoubleRightFill } from '../fill/caret-circle-double-right-fill'
import { CaretCircleDoubleRightLight } from '../light/caret-circle-double-right-light'
import { CaretCircleDoubleRightRegular } from '../regular/caret-circle-double-right-regular'
import { CaretCircleDoubleRightThin } from '../thin/caret-circle-double-right-thin'

const weightMap = {
  regular: CaretCircleDoubleRightRegular,
  bold: CaretCircleDoubleRightBold,
  duotone: CaretCircleDoubleRightDuotone,
  fill: CaretCircleDoubleRightFill,
  light: CaretCircleDoubleRightLight,
  thin: CaretCircleDoubleRightThin,
} as const

export const CaretCircleDoubleRight = (props: IconProps) => {
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
