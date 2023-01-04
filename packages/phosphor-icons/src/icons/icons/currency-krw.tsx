import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyKrwBold } from '../bold/currency-krw-bold'
import { CurrencyKrwDuotone } from '../duotone/currency-krw-duotone'
import { CurrencyKrwFill } from '../fill/currency-krw-fill'
import { CurrencyKrwLight } from '../light/currency-krw-light'
import { CurrencyKrwRegular } from '../regular/currency-krw-regular'
import { CurrencyKrwThin } from '../thin/currency-krw-thin'

const weightMap = {
  regular: CurrencyKrwRegular,
  bold: CurrencyKrwBold,
  duotone: CurrencyKrwDuotone,
  fill: CurrencyKrwFill,
  light: CurrencyKrwLight,
  thin: CurrencyKrwThin,
} as const

export const CurrencyKrw = (props: IconProps) => {
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
