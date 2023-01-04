import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PizzaBold } from '../bold/pizza-bold'
import { PizzaDuotone } from '../duotone/pizza-duotone'
import { PizzaFill } from '../fill/pizza-fill'
import { PizzaLight } from '../light/pizza-light'
import { PizzaRegular } from '../regular/pizza-regular'
import { PizzaThin } from '../thin/pizza-thin'

const weightMap = {
  regular: PizzaRegular,
  bold: PizzaBold,
  duotone: PizzaDuotone,
  fill: PizzaFill,
  light: PizzaLight,
  thin: PizzaThin,
} as const

export const Pizza = (props: IconProps) => {
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
