import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretUpBold } from '../bold/caret-up-bold'
import { CaretUpDuotone } from '../duotone/caret-up-duotone'
import { CaretUpFill } from '../fill/caret-up-fill'
import { CaretUpLight } from '../light/caret-up-light'
import { CaretUpRegular } from '../regular/caret-up-regular'
import { CaretUpThin } from '../thin/caret-up-thin'

const weightMap = {
  regular: CaretUpRegular,
  bold: CaretUpBold,
  duotone: CaretUpDuotone,
  fill: CaretUpFill,
  light: CaretUpLight,
  thin: CaretUpThin,
} as const

export const CaretUp = (props: IconProps) => {
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
