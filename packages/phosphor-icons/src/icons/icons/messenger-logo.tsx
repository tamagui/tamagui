import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MessengerLogoBold } from '../bold/messenger-logo-bold'
import { MessengerLogoDuotone } from '../duotone/messenger-logo-duotone'
import { MessengerLogoFill } from '../fill/messenger-logo-fill'
import { MessengerLogoLight } from '../light/messenger-logo-light'
import { MessengerLogoRegular } from '../regular/messenger-logo-regular'
import { MessengerLogoThin } from '../thin/messenger-logo-thin'

const weightMap = {
  regular: MessengerLogoRegular,
  bold: MessengerLogoBold,
  duotone: MessengerLogoDuotone,
  fill: MessengerLogoFill,
  light: MessengerLogoLight,
  thin: MessengerLogoThin,
} as const

export const MessengerLogo = (props: IconProps) => {
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
