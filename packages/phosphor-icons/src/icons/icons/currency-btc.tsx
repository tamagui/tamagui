import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyBtcBold } from '../bold/currency-btc-bold'
import { CurrencyBtcDuotone } from '../duotone/currency-btc-duotone'
import { CurrencyBtcFill } from '../fill/currency-btc-fill'
import { CurrencyBtcLight } from '../light/currency-btc-light'
import { CurrencyBtcRegular } from '../regular/currency-btc-regular'
import { CurrencyBtcThin } from '../thin/currency-btc-thin'

const weightMap = {
  regular: CurrencyBtcRegular,
  bold: CurrencyBtcBold,
  duotone: CurrencyBtcDuotone,
  fill: CurrencyBtcFill,
  light: CurrencyBtcLight,
  thin: CurrencyBtcThin,
} as const

export const CurrencyBtc = (props: IconProps) => {
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
