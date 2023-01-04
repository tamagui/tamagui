import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyEurBold } from '../bold/currency-eur-bold'
import { CurrencyEurDuotone } from '../duotone/currency-eur-duotone'
import { CurrencyEurFill } from '../fill/currency-eur-fill'
import { CurrencyEurLight } from '../light/currency-eur-light'
import { CurrencyEurRegular } from '../regular/currency-eur-regular'
import { CurrencyEurThin } from '../thin/currency-eur-thin'

const weightMap = {
  regular: CurrencyEurRegular,
  bold: CurrencyEurBold,
  duotone: CurrencyEurDuotone,
  fill: CurrencyEurFill,
  light: CurrencyEurLight,
  thin: CurrencyEurThin,
} as const

export const CurrencyEur = (props: IconProps) => {
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
