import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShoppingCartBold } from '../bold/shopping-cart-bold'
import { ShoppingCartDuotone } from '../duotone/shopping-cart-duotone'
import { ShoppingCartFill } from '../fill/shopping-cart-fill'
import { ShoppingCartLight } from '../light/shopping-cart-light'
import { ShoppingCartRegular } from '../regular/shopping-cart-regular'
import { ShoppingCartThin } from '../thin/shopping-cart-thin'

const weightMap = {
  regular: ShoppingCartRegular,
  bold: ShoppingCartBold,
  duotone: ShoppingCartDuotone,
  fill: ShoppingCartFill,
  light: ShoppingCartLight,
  thin: ShoppingCartThin,
} as const

export const ShoppingCart = (props: IconProps) => {
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
