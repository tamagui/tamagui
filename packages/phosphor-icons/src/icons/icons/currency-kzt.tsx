import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyKztBold } from '../bold/currency-kzt-bold'
import { CurrencyKztDuotone } from '../duotone/currency-kzt-duotone'
import { CurrencyKztFill } from '../fill/currency-kzt-fill'
import { CurrencyKztLight } from '../light/currency-kzt-light'
import { CurrencyKztRegular } from '../regular/currency-kzt-regular'
import { CurrencyKztThin } from '../thin/currency-kzt-thin'

const weightMap = {
  regular: CurrencyKztRegular,
  bold: CurrencyKztBold,
  duotone: CurrencyKztDuotone,
  fill: CurrencyKztFill,
  light: CurrencyKztLight,
  thin: CurrencyKztThin,
} as const

export const CurrencyKzt = (props: IconProps) => {
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
