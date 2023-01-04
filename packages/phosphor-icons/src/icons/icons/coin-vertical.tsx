import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CoinVerticalBold } from '../bold/coin-vertical-bold'
import { CoinVerticalDuotone } from '../duotone/coin-vertical-duotone'
import { CoinVerticalFill } from '../fill/coin-vertical-fill'
import { CoinVerticalLight } from '../light/coin-vertical-light'
import { CoinVerticalRegular } from '../regular/coin-vertical-regular'
import { CoinVerticalThin } from '../thin/coin-vertical-thin'

const weightMap = {
  regular: CoinVerticalRegular,
  bold: CoinVerticalBold,
  duotone: CoinVerticalDuotone,
  fill: CoinVerticalFill,
  light: CoinVerticalLight,
  thin: CoinVerticalThin,
} as const

export const CoinVertical = (props: IconProps) => {
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
