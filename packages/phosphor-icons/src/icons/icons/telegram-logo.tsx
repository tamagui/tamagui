import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TelegramLogoBold } from '../bold/telegram-logo-bold'
import { TelegramLogoDuotone } from '../duotone/telegram-logo-duotone'
import { TelegramLogoFill } from '../fill/telegram-logo-fill'
import { TelegramLogoLight } from '../light/telegram-logo-light'
import { TelegramLogoRegular } from '../regular/telegram-logo-regular'
import { TelegramLogoThin } from '../thin/telegram-logo-thin'

const weightMap = {
  regular: TelegramLogoRegular,
  bold: TelegramLogoBold,
  duotone: TelegramLogoDuotone,
  fill: TelegramLogoFill,
  light: TelegramLogoLight,
  thin: TelegramLogoThin,
} as const

export const TelegramLogo = (props: IconProps) => {
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
