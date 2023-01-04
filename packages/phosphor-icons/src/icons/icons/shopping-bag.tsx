import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShoppingBagBold } from '../bold/shopping-bag-bold'
import { ShoppingBagDuotone } from '../duotone/shopping-bag-duotone'
import { ShoppingBagFill } from '../fill/shopping-bag-fill'
import { ShoppingBagLight } from '../light/shopping-bag-light'
import { ShoppingBagRegular } from '../regular/shopping-bag-regular'
import { ShoppingBagThin } from '../thin/shopping-bag-thin'

const weightMap = {
  regular: ShoppingBagRegular,
  bold: ShoppingBagBold,
  duotone: ShoppingBagDuotone,
  fill: ShoppingBagFill,
  light: ShoppingBagLight,
  thin: ShoppingBagThin,
} as const

export const ShoppingBag = (props: IconProps) => {
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
