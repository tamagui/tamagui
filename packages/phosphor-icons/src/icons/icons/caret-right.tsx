import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretRightBold } from '../bold/caret-right-bold'
import { CaretRightDuotone } from '../duotone/caret-right-duotone'
import { CaretRightFill } from '../fill/caret-right-fill'
import { CaretRightLight } from '../light/caret-right-light'
import { CaretRightRegular } from '../regular/caret-right-regular'
import { CaretRightThin } from '../thin/caret-right-thin'

const weightMap = {
  regular: CaretRightRegular,
  bold: CaretRightBold,
  duotone: CaretRightDuotone,
  fill: CaretRightFill,
  light: CaretRightLight,
  thin: CaretRightThin,
} as const

export const CaretRight = (props: IconProps) => {
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
