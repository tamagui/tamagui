import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CurrencyCnyBold } from '../bold/currency-cny-bold'
import { CurrencyCnyDuotone } from '../duotone/currency-cny-duotone'
import { CurrencyCnyFill } from '../fill/currency-cny-fill'
import { CurrencyCnyLight } from '../light/currency-cny-light'
import { CurrencyCnyRegular } from '../regular/currency-cny-regular'
import { CurrencyCnyThin } from '../thin/currency-cny-thin'

const weightMap = {
  regular: CurrencyCnyRegular,
  bold: CurrencyCnyBold,
  duotone: CurrencyCnyDuotone,
  fill: CurrencyCnyFill,
  light: CurrencyCnyLight,
  thin: CurrencyCnyThin,
} as const

export const CurrencyCny = (props: IconProps) => {
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
