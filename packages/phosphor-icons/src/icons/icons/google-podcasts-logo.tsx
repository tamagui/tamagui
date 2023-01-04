import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GooglePodcastsLogoBold } from '../bold/google-podcasts-logo-bold'
import { GooglePodcastsLogoDuotone } from '../duotone/google-podcasts-logo-duotone'
import { GooglePodcastsLogoFill } from '../fill/google-podcasts-logo-fill'
import { GooglePodcastsLogoLight } from '../light/google-podcasts-logo-light'
import { GooglePodcastsLogoRegular } from '../regular/google-podcasts-logo-regular'
import { GooglePodcastsLogoThin } from '../thin/google-podcasts-logo-thin'

const weightMap = {
  regular: GooglePodcastsLogoRegular,
  bold: GooglePodcastsLogoBold,
  duotone: GooglePodcastsLogoDuotone,
  fill: GooglePodcastsLogoFill,
  light: GooglePodcastsLogoLight,
  thin: GooglePodcastsLogoThin,
} as const

export const GooglePodcastsLogo = (props: IconProps) => {
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
