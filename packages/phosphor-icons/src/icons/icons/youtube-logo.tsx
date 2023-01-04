import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { YoutubeLogoBold } from '../bold/youtube-logo-bold'
import { YoutubeLogoDuotone } from '../duotone/youtube-logo-duotone'
import { YoutubeLogoFill } from '../fill/youtube-logo-fill'
import { YoutubeLogoLight } from '../light/youtube-logo-light'
import { YoutubeLogoRegular } from '../regular/youtube-logo-regular'
import { YoutubeLogoThin } from '../thin/youtube-logo-thin'

const weightMap = {
  regular: YoutubeLogoRegular,
  bold: YoutubeLogoBold,
  duotone: YoutubeLogoDuotone,
  fill: YoutubeLogoFill,
  light: YoutubeLogoLight,
  thin: YoutubeLogoThin,
} as const

export const YoutubeLogo = (props: IconProps) => {
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
