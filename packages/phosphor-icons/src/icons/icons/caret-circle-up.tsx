import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretCircleUpBold } from '../bold/caret-circle-up-bold'
import { CaretCircleUpDuotone } from '../duotone/caret-circle-up-duotone'
import { CaretCircleUpFill } from '../fill/caret-circle-up-fill'
import { CaretCircleUpLight } from '../light/caret-circle-up-light'
import { CaretCircleUpRegular } from '../regular/caret-circle-up-regular'
import { CaretCircleUpThin } from '../thin/caret-circle-up-thin'

const weightMap = {
  regular: CaretCircleUpRegular,
  bold: CaretCircleUpBold,
  duotone: CaretCircleUpDuotone,
  fill: CaretCircleUpFill,
  light: CaretCircleUpLight,
  thin: CaretCircleUpThin,
} as const

export const CaretCircleUp = (props: IconProps) => {
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
