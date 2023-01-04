import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CreditCardBold } from '../bold/credit-card-bold'
import { CreditCardDuotone } from '../duotone/credit-card-duotone'
import { CreditCardFill } from '../fill/credit-card-fill'
import { CreditCardLight } from '../light/credit-card-light'
import { CreditCardRegular } from '../regular/credit-card-regular'
import { CreditCardThin } from '../thin/credit-card-thin'

const weightMap = {
  regular: CreditCardRegular,
  bold: CreditCardBold,
  duotone: CreditCardDuotone,
  fill: CreditCardFill,
  light: CreditCardLight,
  thin: CreditCardThin,
} as const

export const CreditCard = (props: IconProps) => {
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
