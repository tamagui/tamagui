import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpotifyLogoBold } from '../bold/spotify-logo-bold'
import { SpotifyLogoDuotone } from '../duotone/spotify-logo-duotone'
import { SpotifyLogoFill } from '../fill/spotify-logo-fill'
import { SpotifyLogoLight } from '../light/spotify-logo-light'
import { SpotifyLogoRegular } from '../regular/spotify-logo-regular'
import { SpotifyLogoThin } from '../thin/spotify-logo-thin'

const weightMap = {
  regular: SpotifyLogoRegular,
  bold: SpotifyLogoBold,
  duotone: SpotifyLogoDuotone,
  fill: SpotifyLogoFill,
  light: SpotifyLogoLight,
  thin: SpotifyLogoThin,
} as const

export const SpotifyLogo = (props: IconProps) => {
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
