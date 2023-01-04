import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShoppingBagOpenBold } from '../bold/shopping-bag-open-bold'
import { ShoppingBagOpenDuotone } from '../duotone/shopping-bag-open-duotone'
import { ShoppingBagOpenFill } from '../fill/shopping-bag-open-fill'
import { ShoppingBagOpenLight } from '../light/shopping-bag-open-light'
import { ShoppingBagOpenRegular } from '../regular/shopping-bag-open-regular'
import { ShoppingBagOpenThin } from '../thin/shopping-bag-open-thin'

const weightMap = {
  regular: ShoppingBagOpenRegular,
  bold: ShoppingBagOpenBold,
  duotone: ShoppingBagOpenDuotone,
  fill: ShoppingBagOpenFill,
  light: ShoppingBagOpenLight,
  thin: ShoppingBagOpenThin,
} as const

export const ShoppingBagOpen = (props: IconProps) => {
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
