import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MoneyBold } from '../bold/money-bold'
import { MoneyDuotone } from '../duotone/money-duotone'
import { MoneyFill } from '../fill/money-fill'
import { MoneyLight } from '../light/money-light'
import { MoneyRegular } from '../regular/money-regular'
import { MoneyThin } from '../thin/money-thin'

const weightMap = {
  regular: MoneyRegular,
  bold: MoneyBold,
  duotone: MoneyDuotone,
  fill: MoneyFill,
  light: MoneyLight,
  thin: MoneyThin,
} as const

export const Money = (props: IconProps) => {
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
