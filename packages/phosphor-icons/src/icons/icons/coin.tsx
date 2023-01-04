import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CoinBold } from '../bold/coin-bold'
import { CoinDuotone } from '../duotone/coin-duotone'
import { CoinFill } from '../fill/coin-fill'
import { CoinLight } from '../light/coin-light'
import { CoinRegular } from '../regular/coin-regular'
import { CoinThin } from '../thin/coin-thin'

const weightMap = {
  regular: CoinRegular,
  bold: CoinBold,
  duotone: CoinDuotone,
  fill: CoinFill,
  light: CoinLight,
  thin: CoinThin,
} as const

export const Coin = (props: IconProps) => {
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
