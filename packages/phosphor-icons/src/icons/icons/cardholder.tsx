import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CardholderBold } from '../bold/cardholder-bold'
import { CardholderDuotone } from '../duotone/cardholder-duotone'
import { CardholderFill } from '../fill/cardholder-fill'
import { CardholderLight } from '../light/cardholder-light'
import { CardholderRegular } from '../regular/cardholder-regular'
import { CardholderThin } from '../thin/cardholder-thin'

const weightMap = {
  regular: CardholderRegular,
  bold: CardholderBold,
  duotone: CardholderDuotone,
  fill: CardholderFill,
  light: CardholderLight,
  thin: CardholderThin,
} as const

export const Cardholder = (props: IconProps) => {
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
