import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyGbpBold } from '../bold/currency-gbp-bold'
import { CurrencyGbpDuotone } from '../duotone/currency-gbp-duotone'
import { CurrencyGbpFill } from '../fill/currency-gbp-fill'
import { CurrencyGbpLight } from '../light/currency-gbp-light'
import { CurrencyGbpRegular } from '../regular/currency-gbp-regular'
import { CurrencyGbpThin } from '../thin/currency-gbp-thin'

const weightMap = {
  regular: CurrencyGbpRegular,
  bold: CurrencyGbpBold,
  duotone: CurrencyGbpDuotone,
  fill: CurrencyGbpFill,
  light: CurrencyGbpLight,
  thin: CurrencyGbpThin,
} as const

export const CurrencyGbp = (props: IconProps) => {
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
