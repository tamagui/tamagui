import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyDollarBold } from '../bold/currency-dollar-bold'
import { CurrencyDollarDuotone } from '../duotone/currency-dollar-duotone'
import { CurrencyDollarFill } from '../fill/currency-dollar-fill'
import { CurrencyDollarLight } from '../light/currency-dollar-light'
import { CurrencyDollarRegular } from '../regular/currency-dollar-regular'
import { CurrencyDollarThin } from '../thin/currency-dollar-thin'

const weightMap = {
  regular: CurrencyDollarRegular,
  bold: CurrencyDollarBold,
  duotone: CurrencyDollarDuotone,
  fill: CurrencyDollarFill,
  light: CurrencyDollarLight,
  thin: CurrencyDollarThin,
} as const

export const CurrencyDollar = (props: IconProps) => {
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
