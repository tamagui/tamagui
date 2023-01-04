import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyNgnBold } from '../bold/currency-ngn-bold'
import { CurrencyNgnDuotone } from '../duotone/currency-ngn-duotone'
import { CurrencyNgnFill } from '../fill/currency-ngn-fill'
import { CurrencyNgnLight } from '../light/currency-ngn-light'
import { CurrencyNgnRegular } from '../regular/currency-ngn-regular'
import { CurrencyNgnThin } from '../thin/currency-ngn-thin'

const weightMap = {
  regular: CurrencyNgnRegular,
  bold: CurrencyNgnBold,
  duotone: CurrencyNgnDuotone,
  fill: CurrencyNgnFill,
  light: CurrencyNgnLight,
  thin: CurrencyNgnThin,
} as const

export const CurrencyNgn = (props: IconProps) => {
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
