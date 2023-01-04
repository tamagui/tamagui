import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyCircleDollarBold } from '../bold/currency-circle-dollar-bold'
import { CurrencyCircleDollarDuotone } from '../duotone/currency-circle-dollar-duotone'
import { CurrencyCircleDollarFill } from '../fill/currency-circle-dollar-fill'
import { CurrencyCircleDollarLight } from '../light/currency-circle-dollar-light'
import { CurrencyCircleDollarRegular } from '../regular/currency-circle-dollar-regular'
import { CurrencyCircleDollarThin } from '../thin/currency-circle-dollar-thin'

const weightMap = {
  regular: CurrencyCircleDollarRegular,
  bold: CurrencyCircleDollarBold,
  duotone: CurrencyCircleDollarDuotone,
  fill: CurrencyCircleDollarFill,
  light: CurrencyCircleDollarLight,
  thin: CurrencyCircleDollarThin,
} as const

export const CurrencyCircleDollar = (props: IconProps) => {
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
