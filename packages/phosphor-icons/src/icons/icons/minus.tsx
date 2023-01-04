import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MinusBold } from '../bold/minus-bold'
import { MinusDuotone } from '../duotone/minus-duotone'
import { MinusFill } from '../fill/minus-fill'
import { MinusLight } from '../light/minus-light'
import { MinusRegular } from '../regular/minus-regular'
import { MinusThin } from '../thin/minus-thin'

const weightMap = {
  regular: MinusRegular,
  bold: MinusBold,
  duotone: MinusDuotone,
  fill: MinusFill,
  light: MinusLight,
  thin: MinusThin,
} as const

export const Minus = (props: IconProps) => {
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
