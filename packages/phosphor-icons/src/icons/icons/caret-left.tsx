import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretLeftBold } from '../bold/caret-left-bold'
import { CaretLeftDuotone } from '../duotone/caret-left-duotone'
import { CaretLeftFill } from '../fill/caret-left-fill'
import { CaretLeftLight } from '../light/caret-left-light'
import { CaretLeftRegular } from '../regular/caret-left-regular'
import { CaretLeftThin } from '../thin/caret-left-thin'

const weightMap = {
  regular: CaretLeftRegular,
  bold: CaretLeftBold,
  duotone: CaretLeftDuotone,
  fill: CaretLeftFill,
  light: CaretLeftLight,
  thin: CaretLeftThin,
} as const

export const CaretLeft = (props: IconProps) => {
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
