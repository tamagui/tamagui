import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyRubBold } from '../bold/currency-rub-bold'
import { CurrencyRubDuotone } from '../duotone/currency-rub-duotone'
import { CurrencyRubFill } from '../fill/currency-rub-fill'
import { CurrencyRubLight } from '../light/currency-rub-light'
import { CurrencyRubRegular } from '../regular/currency-rub-regular'
import { CurrencyRubThin } from '../thin/currency-rub-thin'

const weightMap = {
  regular: CurrencyRubRegular,
  bold: CurrencyRubBold,
  duotone: CurrencyRubDuotone,
  fill: CurrencyRubFill,
  light: CurrencyRubLight,
  thin: CurrencyRubThin,
} as const

export const CurrencyRub = (props: IconProps) => {
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
