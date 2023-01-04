import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlusMinusBold } from '../bold/plus-minus-bold'
import { PlusMinusDuotone } from '../duotone/plus-minus-duotone'
import { PlusMinusFill } from '../fill/plus-minus-fill'
import { PlusMinusLight } from '../light/plus-minus-light'
import { PlusMinusRegular } from '../regular/plus-minus-regular'
import { PlusMinusThin } from '../thin/plus-minus-thin'

const weightMap = {
  regular: PlusMinusRegular,
  bold: PlusMinusBold,
  duotone: PlusMinusDuotone,
  fill: PlusMinusFill,
  light: PlusMinusLight,
  thin: PlusMinusThin,
} as const

export const PlusMinus = (props: IconProps) => {
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
