import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ApplePodcastsLogoBold } from '../bold/apple-podcasts-logo-bold'
import { ApplePodcastsLogoDuotone } from '../duotone/apple-podcasts-logo-duotone'
import { ApplePodcastsLogoFill } from '../fill/apple-podcasts-logo-fill'
import { ApplePodcastsLogoLight } from '../light/apple-podcasts-logo-light'
import { ApplePodcastsLogoRegular } from '../regular/apple-podcasts-logo-regular'
import { ApplePodcastsLogoThin } from '../thin/apple-podcasts-logo-thin'

const weightMap = {
  regular: ApplePodcastsLogoRegular,
  bold: ApplePodcastsLogoBold,
  duotone: ApplePodcastsLogoDuotone,
  fill: ApplePodcastsLogoFill,
  light: ApplePodcastsLogoLight,
  thin: ApplePodcastsLogoThin,
} as const

export const ApplePodcastsLogo = (props: IconProps) => {
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
