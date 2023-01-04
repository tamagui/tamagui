import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyDollarSimpleBold } from '../bold/currency-dollar-simple-bold'
import { CurrencyDollarSimpleDuotone } from '../duotone/currency-dollar-simple-duotone'
import { CurrencyDollarSimpleFill } from '../fill/currency-dollar-simple-fill'
import { CurrencyDollarSimpleLight } from '../light/currency-dollar-simple-light'
import { CurrencyDollarSimpleRegular } from '../regular/currency-dollar-simple-regular'
import { CurrencyDollarSimpleThin } from '../thin/currency-dollar-simple-thin'

const weightMap = {
  regular: CurrencyDollarSimpleRegular,
  bold: CurrencyDollarSimpleBold,
  duotone: CurrencyDollarSimpleDuotone,
  fill: CurrencyDollarSimpleFill,
  light: CurrencyDollarSimpleLight,
  thin: CurrencyDollarSimpleThin,
} as const

export const CurrencyDollarSimple = (props: IconProps) => {
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
