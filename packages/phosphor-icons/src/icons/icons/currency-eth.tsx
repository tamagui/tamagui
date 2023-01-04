import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyEthBold } from '../bold/currency-eth-bold'
import { CurrencyEthDuotone } from '../duotone/currency-eth-duotone'
import { CurrencyEthFill } from '../fill/currency-eth-fill'
import { CurrencyEthLight } from '../light/currency-eth-light'
import { CurrencyEthRegular } from '../regular/currency-eth-regular'
import { CurrencyEthThin } from '../thin/currency-eth-thin'

const weightMap = {
  regular: CurrencyEthRegular,
  bold: CurrencyEthBold,
  duotone: CurrencyEthDuotone,
  fill: CurrencyEthFill,
  light: CurrencyEthLight,
  thin: CurrencyEthThin,
} as const

export const CurrencyEth = (props: IconProps) => {
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
