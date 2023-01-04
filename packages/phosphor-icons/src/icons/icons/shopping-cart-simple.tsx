import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShoppingCartSimpleBold } from '../bold/shopping-cart-simple-bold'
import { ShoppingCartSimpleDuotone } from '../duotone/shopping-cart-simple-duotone'
import { ShoppingCartSimpleFill } from '../fill/shopping-cart-simple-fill'
import { ShoppingCartSimpleLight } from '../light/shopping-cart-simple-light'
import { ShoppingCartSimpleRegular } from '../regular/shopping-cart-simple-regular'
import { ShoppingCartSimpleThin } from '../thin/shopping-cart-simple-thin'

const weightMap = {
  regular: ShoppingCartSimpleRegular,
  bold: ShoppingCartSimpleBold,
  duotone: ShoppingCartSimpleDuotone,
  fill: ShoppingCartSimpleFill,
  light: ShoppingCartSimpleLight,
  thin: ShoppingCartSimpleThin,
} as const

export const ShoppingCartSimple = (props: IconProps) => {
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
