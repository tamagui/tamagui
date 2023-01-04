import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CoinsBold } from '../bold/coins-bold'
import { CoinsDuotone } from '../duotone/coins-duotone'
import { CoinsFill } from '../fill/coins-fill'
import { CoinsLight } from '../light/coins-light'
import { CoinsRegular } from '../regular/coins-regular'
import { CoinsThin } from '../thin/coins-thin'

const weightMap = {
  regular: CoinsRegular,
  bold: CoinsBold,
  duotone: CoinsDuotone,
  fill: CoinsFill,
  light: CoinsLight,
  thin: CoinsThin,
} as const

export const Coins = (props: IconProps) => {
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
