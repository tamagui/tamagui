import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TwitchLogoBold } from '../bold/twitch-logo-bold'
import { TwitchLogoDuotone } from '../duotone/twitch-logo-duotone'
import { TwitchLogoFill } from '../fill/twitch-logo-fill'
import { TwitchLogoLight } from '../light/twitch-logo-light'
import { TwitchLogoRegular } from '../regular/twitch-logo-regular'
import { TwitchLogoThin } from '../thin/twitch-logo-thin'

const weightMap = {
  regular: TwitchLogoRegular,
  bold: TwitchLogoBold,
  duotone: TwitchLogoDuotone,
  fill: TwitchLogoFill,
  light: TwitchLogoLight,
  thin: TwitchLogoThin,
} as const

export const TwitchLogo = (props: IconProps) => {
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
