import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CoffeeBold } from '../bold/coffee-bold'
import { CoffeeDuotone } from '../duotone/coffee-duotone'
import { CoffeeFill } from '../fill/coffee-fill'
import { CoffeeLight } from '../light/coffee-light'
import { CoffeeRegular } from '../regular/coffee-regular'
import { CoffeeThin } from '../thin/coffee-thin'

const weightMap = {
  regular: CoffeeRegular,
  bold: CoffeeBold,
  duotone: CoffeeDuotone,
  fill: CoffeeFill,
  light: CoffeeLight,
  thin: CoffeeThin,
} as const

export const Coffee = (props: IconProps) => {
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
