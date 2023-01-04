import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StripeLogoBold } from '../bold/stripe-logo-bold'
import { StripeLogoDuotone } from '../duotone/stripe-logo-duotone'
import { StripeLogoFill } from '../fill/stripe-logo-fill'
import { StripeLogoLight } from '../light/stripe-logo-light'
import { StripeLogoRegular } from '../regular/stripe-logo-regular'
import { StripeLogoThin } from '../thin/stripe-logo-thin'

const weightMap = {
  regular: StripeLogoRegular,
  bold: StripeLogoBold,
  duotone: StripeLogoDuotone,
  fill: StripeLogoFill,
  light: StripeLogoLight,
  thin: StripeLogoThin,
} as const

export const StripeLogo = (props: IconProps) => {
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
