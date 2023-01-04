import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiscordLogoBold } from '../bold/discord-logo-bold'
import { DiscordLogoDuotone } from '../duotone/discord-logo-duotone'
import { DiscordLogoFill } from '../fill/discord-logo-fill'
import { DiscordLogoLight } from '../light/discord-logo-light'
import { DiscordLogoRegular } from '../regular/discord-logo-regular'
import { DiscordLogoThin } from '../thin/discord-logo-thin'

const weightMap = {
  regular: DiscordLogoRegular,
  bold: DiscordLogoBold,
  duotone: DiscordLogoDuotone,
  fill: DiscordLogoFill,
  light: DiscordLogoLight,
  thin: DiscordLogoThin,
} as const

export const DiscordLogo = (props: IconProps) => {
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
