import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyInrBold } from '../bold/currency-inr-bold'
import { CurrencyInrDuotone } from '../duotone/currency-inr-duotone'
import { CurrencyInrFill } from '../fill/currency-inr-fill'
import { CurrencyInrLight } from '../light/currency-inr-light'
import { CurrencyInrRegular } from '../regular/currency-inr-regular'
import { CurrencyInrThin } from '../thin/currency-inr-thin'

const weightMap = {
  regular: CurrencyInrRegular,
  bold: CurrencyInrBold,
  duotone: CurrencyInrDuotone,
  fill: CurrencyInrFill,
  light: CurrencyInrLight,
  thin: CurrencyInrThin,
} as const

export const CurrencyInr = (props: IconProps) => {
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
