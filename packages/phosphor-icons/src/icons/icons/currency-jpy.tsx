import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyJpyBold } from '../bold/currency-jpy-bold'
import { CurrencyJpyDuotone } from '../duotone/currency-jpy-duotone'
import { CurrencyJpyFill } from '../fill/currency-jpy-fill'
import { CurrencyJpyLight } from '../light/currency-jpy-light'
import { CurrencyJpyRegular } from '../regular/currency-jpy-regular'
import { CurrencyJpyThin } from '../thin/currency-jpy-thin'

const weightMap = {
  regular: CurrencyJpyRegular,
  bold: CurrencyJpyBold,
  duotone: CurrencyJpyDuotone,
  fill: CurrencyJpyFill,
  light: CurrencyJpyLight,
  thin: CurrencyJpyThin,
} as const

export const CurrencyJpy = (props: IconProps) => {
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
